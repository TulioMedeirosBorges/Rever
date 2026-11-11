import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { deChave, horariosDoLembrete, paraMinutos } from './datas';

const CANAL = 'lembretes';
// Margem de segurança: sistemas limitam quantas notificações um app pode deixar agendadas.
const LIMITE = 60;

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

// 0 = segunda ... 6 = domingo  →  expo: 1 = domingo ... 7 = sábado
const diaDoExpo = (indice) => ((indice + 1) % 7) + 1;

const gatilhos = ({ frequencia, ...lembrete }) =>
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

// Sessões de projeto ainda por fazer viram notificações de data marcada.
const sessoesAgendaveis = (projetos) => {
  const agora = Date.now();
  return projetos
    .filter(({ horario }) => /^\d{2}:\d{2}$/.test(horario ?? ''))
    .flatMap((projeto) =>
      projeto.sessoes
        .filter(({ feita }) => !feita)
        .map((sessao) => {
          const data = deChave(sessao.data);
          const minutos = paraMinutos(projeto.horario);
          data.setHours(Math.floor(minutos / 60), minutos % 60, 0, 0);
          return { projeto, sessao, data };
        })
        .filter(({ data }) => data.getTime() > agora),
    )
    .sort((a, b) => a.data - b.data);
};

// Refaz todos os agendamentos a partir dos hábitos e dos projetos.
export async function sincronizarLembretes(habitos, projetos = []) {
  if (Platform.OS === 'web') {
    return;
  }
  await Notifications.cancelAllScheduledNotificationsAsync();

  const deHabitos = habitos
    .filter(({ lembrete, frequencia }) => lembrete !== '' && frequencia.length > 0)
    .flatMap((habito) =>
      gatilhos(habito).map((trigger, indice) => ({
        trigger,
        content: { title: habito.nome, body: frases[indice % frases.length] },
      })),
    );
  const deProjetos = sessoesAgendaveis(projetos).map(({ projeto, sessao, data }) => ({
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: data,
      channelId: CANAL,
    },
    content: { title: `Foco: ${projeto.nome}`, body: `${sessao.titulo} · ${sessao.minutos} min` },
  }));
  // Hábitos primeiro (se repetem), depois as sessões mais próximas.
  const agendamentos = [...deHabitos, ...deProjetos].slice(0, LIMITE);

  if (agendamentos.length === 0 || !(await pedirPermissao())) {
    return;
  }

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
