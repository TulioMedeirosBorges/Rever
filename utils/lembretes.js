import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import {
  chaveDia,
  deChave,
  horariosDoLembrete,
  indiceSemana,
  paraMinutos,
  somarDias,
} from './datas';
import {
  ANTECEDENCIA_AVISO,
  chaveHabito,
  chaveSessao,
  horarioDoDia,
  horarioLimite,
  minutoDoAviso,
  toleranciaDe,
} from './prazos';

const CANAL = 'lembretes';
// Margem de segurança: sistemas limitam quantas notificações um app pode deixar agendadas.
const LIMITE = 60;
// Avisos de prazo e lembretes de data marcada são agendados para os próximos dias.
const DIAS_A_FRENTE = 7;

// Categoria com botões na própria notificação de prazo.
export const CATEGORIA_PRAZO = 'prazo';
export const ACAO_COMECAR = 'comecar';
export const ACAO_ADIAR = 'adiar';

const frases = [
  'Bora manter o ritmo?',
  'Hora de cuidar de você.',
  'O Revi está contando com você!',
  'Um pequeno passo agora.',
];

if (Platform.OS !== 'web') {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

const pedirPermissao = async () => {
  if (Platform.OS === 'android') {
    // No Android 13+ o pedido de permissão só aparece depois que existe um canal.
    await Notifications.setNotificationChannelAsync(CANAL, {
      name: 'Lembretes de hábitos',
      importance: Notifications.AndroidImportance.HIGH,
    });
  }
  const atual = await Notifications.getPermissionsAsync();
  if (atual.granted) {
    return true;
  }
  const pedido = await Notifications.requestPermissionsAsync();
  return pedido.granted;
};

const criarCategoriaPrazo = () =>
  Notifications.setNotificationCategoryAsync(CATEGORIA_PRAZO, [
    {
      identifier: ACAO_COMECAR,
      buttonTitle: 'Começar agora',
      options: { opensAppToForeground: true },
    },
    { identifier: ACAO_ADIAR, buttonTitle: 'Mais tarde', options: { opensAppToForeground: true } },
  ]).catch(() => {});

// 0 = segunda ... 6 = domingo  →  expo: 1 = domingo ... 7 = sábado
const diaDoExpo = (indice) => ((indice + 1) % 7) + 1;

const gatilhosSemanais = ({ frequencia, ...lembrete }) =>
  horariosDoLembrete(lembrete).flatMap((horario) => {
    const minutos = paraMinutos(horario);
    const hora = { hour: Math.floor(minutos / 60), minute: minutos % 60, channelId: CANAL };

    if (frequencia.length === 7) {
      return [{ type: Notifications.SchedulableTriggerInputTypes.DAILY, ...hora }];
    }
    return frequencia.map((dia) => ({
      type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
      weekday: diaDoExpo(dia),
      ...hora,
    }));
  });

const naData = (data, minutosDoDia) => {
  const momento = new Date(data);
  momento.setHours(Math.floor(minutosDoDia / 60), minutosDoDia % 60, 0, 0);
  return momento;
};

const gatilhoNaData = (momento) => ({
  type: Notifications.SchedulableTriggerInputTypes.DATE,
  date: momento,
  channelId: CANAL,
});

// "Passou do horário": chega logo depois do limite para começar. Sem tolerância,
// espera 15 min depois do horário (o lembrete normal já chegou na hora).
const ESPERA_SEM_TOLERANCIA = 15;

const avisoDeAtraso = ({ nome, horario, tolerancia, data, dados }) => {
  if (!horario) {
    return null;
  }
  const minuto = Math.min(
    paraMinutos(horario) + (tolerancia > 0 ? tolerancia : ESPERA_SEM_TOLERANCIA) + 1,
    23 * 60 + 59,
  );
  return {
    momento: naData(data, minuto),
    content: {
      title: `Passou do horário: ${nome}`,
      body: 'O Revi ficou triste… Toca pra mudar o horário ou confirmar que não vai fazer hoje.',
      data: { tipo: 'atraso', ...dados },
    },
  };
};

const avisoDePrazo = ({ nome, horario, tolerancia, data, dados }) => {
  const minuto = minutoDoAviso(horario, tolerancia);
  if (minuto === null) {
    return null;
  }
  const falta = Math.min(ANTECEDENCIA_AVISO, tolerancia);
  return {
    momento: naData(data, minuto),
    content: {
      title: `Faltam ${falta} min pra começar: ${nome}`,
      body: `O prazo vai até ${horarioLimite(horario, tolerancia)}. Começa agora ou muda o horário pra mais tarde?`,
      categoryIdentifier: CATEGORIA_PRAZO,
      data: { tipo: 'prazo', ...dados },
    },
  };
};

// Refaz todos os agendamentos a partir dos hábitos, dos projetos, do que já foi feito hoje
// e dos horários adiados para hoje.
export async function sincronizarLembretes({
  habitos,
  projetos = [],
  feitosHoje = [],
  adiamentos = {},
  puladosHoje = [],
}) {
  if (Platform.OS === 'web') {
    return;
  }
  await Notifications.cancelAllScheduledNotificationsAsync();

  const agora = new Date();
  const hojeChave = chaveDia(agora);
  const adiadosHoje = adiamentos[hojeChave] ?? {};

  // 1) Lembretes de sempre dos hábitos (se repetem toda semana).
  const semanais = habitos
    .filter(({ lembrete, frequencia }) => lembrete !== '' && frequencia.length > 0)
    .flatMap((habito) =>
      gatilhosSemanais(habito).map((trigger, indice) => ({
        trigger,
        content: { title: habito.nome, body: frases[indice % frases.length] },
      })),
    );

  // 2) O que tem data: avisos de prazo, horários adiados e sessões de projeto, nos próximos dias.
  const datados = [];
  for (let distancia = 0; distancia < DIAS_A_FRENTE; distancia += 1) {
    const data = somarDias(agora, distancia);
    const chave = chaveDia(data);
    const ehHoje = chave === hojeChave;

    habitos
      .filter(({ frequencia, lembrete }) => lembrete && frequencia.includes(indiceSemana(data)))
      .forEach((habito) => {
        const chaveItem = chaveHabito(habito);
        // Feito, ou a pessoa já confirmou que não vai fazer: nada de aviso hoje.
        if (ehHoje && (feitosHoje.includes(habito.id) || puladosHoje.includes(chaveItem))) {
          return;
        }
        const horario = ehHoje
          ? horarioDoDia(habito.lembrete, adiadosHoje, chaveItem)
          : habito.lembrete;
        if (ehHoje && adiadosHoje[chaveItem]) {
          datados.push({
            momento: naData(data, paraMinutos(horario)),
            content: { title: habito.nome, body: `Chegou o novo horário (${horario}). Bora!` },
          });
        }
        const sobreHabito = {
          nome: habito.nome,
          horario,
          tolerancia: toleranciaDe(habito),
          data,
          dados: { chave: chaveItem, habitoId: habito.id },
        };
        [avisoDePrazo(sobreHabito), avisoDeAtraso(sobreHabito)]
          .filter(Boolean)
          .forEach((aviso) => datados.push(aviso));
      });

    projetos
      .filter(({ horario }) => /^\d{2}:\d{2}$/.test(horario ?? ''))
      .forEach((projeto) =>
        projeto.sessoes
          .filter((sessao) => sessao.data === chave && !sessao.feita)
          .forEach((sessao) => {
            const chaveItem = chaveSessao(projeto, sessao);
            if (ehHoje && puladosHoje.includes(chaveItem)) {
              return;
            }
            const horario = ehHoje
              ? horarioDoDia(projeto.horario, adiadosHoje, chaveItem)
              : projeto.horario;
            datados.push({
              momento: naData(deChave(sessao.data), paraMinutos(horario)),
              content: {
                title: `Foco: ${projeto.nome}`,
                body: `${sessao.titulo} · ${sessao.minutos} min`,
              },
            });
            const sobreSessao = {
              nome: sessao.titulo,
              horario,
              tolerancia: toleranciaDe(projeto),
              data,
              dados: {
                chave: chaveItem,
                projetoId: projeto.id,
                sessaoId: sessao.id,
                minutos: sessao.minutos,
                titulo: `${projeto.nome}: ${sessao.titulo}`,
              },
            };
            [avisoDePrazo(sobreSessao), avisoDeAtraso(sobreSessao)]
              .filter(Boolean)
              .forEach((aviso) => datados.push(aviso));
          }),
      );
  }

  // Hábitos primeiro (se repetem), depois o que tem data, do mais próximo ao mais distante.
  const futuros = datados
    .filter(({ momento }) => momento.getTime() > agora.getTime())
    .sort((a, b) => a.momento - b.momento)
    .map(({ momento, content }) => ({ content, trigger: gatilhoNaData(momento) }));
  const agendamentos = [...semanais, ...futuros].slice(0, LIMITE);

  if (agendamentos.length === 0 || !(await pedirPermissao())) {
    return;
  }
  await criarCategoriaPrazo();
  await Promise.all(
    agendamentos.map(({ content, trigger }) =>
      Notifications.scheduleNotificationAsync({ content, trigger }),
    ),
  );
}

// Ao sair da conta, os lembretes dela não podem continuar tocando para a próxima pessoa.
export async function cancelarLembretes() {
  if (Platform.OS !== 'web') {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }
}
