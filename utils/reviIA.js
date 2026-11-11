import { categorias, icones, siglasDias } from '../data/opcoes';
import { chaveDia, indiceSemana, inicioDaSemana, somarDias } from './datas';

const hojeTexto = (hoje) => `${chaveDia(hoje)} (${siglasDias[indiceSemana(hoje)]})`;

const descreverHabitos = (habitos) =>
  habitos.length === 0
    ? 'nenhum ainda'
    : habitos
        .map(
          ({ nome, frequencia, lembrete }) =>
            `${nome} (${frequencia.map((dia) => siglasDias[dia]).join(', ')}${
              lembrete ? ` às ${lembrete}` : ''
            })`,
        )
        .join('; ');

// ---------- Conversa: o Revi ajuda a montar a rotina ----------

// Calendário dos próximos dias, para a IA acertar "dia 23", "sexta que vem" etc.
const calendario = (hoje, dias = 45) =>
  Array.from({ length: dias }, (_, i) => {
    const data = somarDias(hoje, i);
    return `${chaveDia(data)} ${siglasDias[indiceSemana(data)]}`;
  }).join(', ');

export const instrucoesConversa = ({
  nomeRevi,
  nomeUsuario,
  habitos,
  projetos = [],
  hoje = new Date(),
}) => `
Você é ${nomeRevi}, o mascote em pixel art do app de hábitos Rever. Fale com ${nomeUsuario} em português do Brasil,
com frases curtas, tom amigável e animado (no máximo 3 frases, até 60 palavras).
Seu trabalho é ENTENDER o pedido e já resolver, sem enrolar:

1. Se a pessoa disser um objetivo (ex.: "quero dormir às 23h", "quero beber mais água"), NÃO pergunte antes:
   sugira na hora de 1 a 4 hábitos pequenos em "habitos", com horários calculados a partir do que ela disse
   (ex.: dormir 23h → desligar telas 22:00, ler 22:20, deitar 23:00). A pessoa decide nos botões.
2. Se a pessoa PEDIR para criar/montar/lançar/agendar/colocar no app (ou aceitar uma sugestão sua, ex.: "pode criar",
   "adiciona", "sim") e você souber o essencial, CRIE direto em "acoes" e conte na "resposta" o que criou.
   - Rotina que se repete toda semana → "acoes.habitos".
   - Meta com data (prova, entrega, viagem, TCC) → "acoes.projeto" com sessões de foco ATÉ o dia anterior ao prazo,
     respeitando os dias livres dela; se ela não disser os dias, use todos. Se fizer sentido, crie também hábitos.
   - Sempre coloque horário de lembrete ("lembrete" nos hábitos e "horario" no projeto): é ele que vira notificação.
3. Só pergunte se faltar algo impossível de deduzir (ex.: a data da prova). Uma pergunta por vez.
4. Sempre mande em "opcoes" 2 ou 3 respostas curtas (até 28 letras) que a pessoa pode tocar para continuar,
   como "Pode criar tudo", "Mais leve", "Outro horário".
Não repita hábitos que a pessoa já tem. Não dê diagnóstico nem conselho médico.

Hoje é ${hojeTexto(hoje)}. Próximos dias: ${calendario(hoje)}.
Hábitos atuais: ${descreverHabitos(habitos)}.
Projetos atuais: ${projetos.map(({ nome, prazo }) => `${nome} (até ${prazo})`).join('; ') || 'nenhum'}.
Dias da semana nos hábitos: 0 = segunda ... 6 = domingo.

Responda SEMPRE só com JSON neste formato (listas podem ficar vazias, "projeto" pode ser null):
{"resposta": "sua fala",
 "opcoes": ["resposta rápida 1", "resposta rápida 2"],
 "habitos": [HABITO],
 "acoes": {"habitos": [HABITO],
   "projeto": {"nome": "até 30 letras", "objetivo": "frase curta", "prazo": "AAAA-MM-DD", "dias": [0..6],
     "porSemana": 1 a 7, "minutos": 15 a 180, "horario": "HH:MM", "etapas": ["etapa"],
     "sessoes": [{"data": "AAAA-MM-DD", "titulo": "até 40 letras", "minutos": 45}]}}}
HABITO = {"nome": "até 20 letras", "icone": "${icones.join('|')}", "categoria": "${categorias.join('|')}",
 "frequencia": [0..6], "lembrete": "HH:MM", "repetir": 0 a 4 (horas entre lembretes; 0 = não repete)}
"habitos" (fora de "acoes") são só sugestões com botão; "acoes" é o que você cria de verdade.
`;

const horarioValido = (texto) => /^([01]\d|2[0-3]):[0-5]\d$/.test(texto ?? '');

// Confere cada hábito sugerido; o que vier fora do padrão é corrigido ou descartado.
export const validarHabitos = (lista, existentes) => {
  if (!Array.isArray(lista)) {
    return [];
  }
  const nomesExistentes = new Set(existentes.map(({ nome }) => nome.toLowerCase()));
  return lista
    .map((item) => {
      const nome = String(item?.nome ?? '')
        .trim()
        .slice(0, 24);
      const frequencia = [
        ...new Set((item?.frequencia ?? []).map(Number).filter((dia) => dia >= 0 && dia <= 6)),
      ].sort((a, b) => a - b);
      const lembrete = horarioValido(item?.lembrete) ? item.lembrete : '';
      const repetir = lembrete
        ? Math.max(0, Math.min(4, Math.round(Number(item?.repetir) || 0)))
        : 0;
      return {
        nome,
        icone: icones.includes(item?.icone) ? item.icone : 'sparkle',
        categoria: categorias.includes(item?.categoria) ? item.categoria : 'Bem-estar',
        frequencia: frequencia.length > 0 ? frequencia : [0, 1, 2, 3, 4, 5, 6],
        lembrete,
        repetir,
        ate: repetir > 0 ? '21:00' : '',
      };
    })
    .filter(({ nome }) => nome !== '' && !nomesExistentes.has(nome.toLowerCase()))
    .slice(0, 4);
};

// ---------- Projetos: o Revi distribui as sessões no cronograma ----------

// Quantos hábitos a pessoa já tem em cada dia da semana (0 = segunda).
export const cargaPorDia = (habitos) =>
  Array.from(
    { length: 7 },
    (_, dia) => habitos.filter(({ frequencia }) => frequencia.includes(dia)).length,
  );

export const instrucoesProjeto = ({ nomeRevi, habitos, hoje = new Date() }) => `
Você é ${nomeRevi}, mascote do app de hábitos Rever, e planeja projetos pessoais em português do Brasil.
Divida o projeto em etapas curtas e distribua sessões de foco no calendário, respeitando estas regras:
- só use datas entre amanhã e o prazo (inclusive), no formato AAAA-MM-DD;
- só use os dias da semana permitidos e no máximo a quantidade de sessões por semana pedida;
- prefira os dias com menos hábitos, para não sobrecarregar a pessoa;
- comece com planejamento e termine com revisão.
Hoje é ${hojeTexto(hoje)}. Hábitos da pessoa por dia: ${descreverHabitos(habitos)}.
Carga por dia (seg..dom): ${cargaPorDia(habitos).join(', ')}.

Responda SEMPRE só com JSON neste formato:
{"resumo": "1 ou 2 frases animadas do Revi sobre o plano", "etapas": ["etapa 1", "etapa 2"],
"sessoes": [{"data": "AAAA-MM-DD", "titulo": "o que fazer na sessão (até 40 letras)", "minutos": 45}]}
`;

export const pedidoProjeto = ({ nome, objetivo, prazo, dias, porSemana, minutos }) =>
  `Projeto: ${nome}. Objetivo: ${objetivo || 'não informado'}. Prazo: ${prazo}.
Dias permitidos: ${dias.map((dia) => siglasDias[dia]).join(', ')}.
Sessões por semana: no máximo ${porSemana}. Duração de cada sessão: cerca de ${minutos} minutos.`;

const paraData = (chave) => {
  const [ano, mes, dia] = chave.split('-').map(Number);
  return new Date(ano, mes - 1, dia);
};

// Mantém só sessões válidas: dentro do prazo, nos dias permitidos e no limite por semana.
export const validarSessoes = (lista, { prazo, dias, porSemana, minutos }, hoje = new Date()) => {
  if (!Array.isArray(lista)) {
    return [];
  }
  const amanha = chaveDia(somarDias(hoje, 1));
  const porSemanaUsadas = {};
  const vistas = new Set();
  return lista
    .filter((item) => /^\d{4}-\d{2}-\d{2}$/.test(item?.data ?? ''))
    .sort((a, b) => a.data.localeCompare(b.data))
    .filter(({ data }) => {
      if (data < amanha || data > prazo || vistas.has(data)) {
        return false;
      }
      const dataReal = paraData(data);
      if (chaveDia(dataReal) !== data || !dias.includes(indiceSemana(dataReal))) {
        return false;
      }
      const semana = chaveDia(inicioDaSemana(dataReal));
      porSemanaUsadas[semana] = (porSemanaUsadas[semana] ?? 0) + 1;
      if (porSemanaUsadas[semana] > porSemana) {
        return false;
      }
      vistas.add(data);
      return true;
    })
    .slice(0, 60)
    .map((item, indice) => ({
      id: `s${indice + 1}`,
      data: item.data,
      titulo:
        String(item.titulo ?? '')
          .trim()
          .slice(0, 40) || `Sessão ${indice + 1}`,
      minutos: Math.max(15, Math.min(240, Math.round(Number(item.minutos) || minutos))),
      tarefas: (Array.isArray(item.tarefas) ? item.tarefas : [])
        .map((tarefa) => String(tarefa).trim().slice(0, 60))
        .filter(Boolean)
        .slice(0, 5),
      tarefasFeitas: [],
      feita: false,
    }));
};

// Plano feito no próprio app (quando não há IA): escolhe, em cada semana, os dias permitidos
// com menos hábitos, até o prazo.
export const planoLocal = (
  { nome, prazo, dias, porSemana, minutos },
  habitos,
  hoje = new Date(),
) => {
  const carga = cargaPorDia(habitos);
  const datas = [];
  let semanaAtual = null;
  let candidatas = [];
  const fecharSemana = () => {
    candidatas
      .sort((a, b) => carga[indiceSemana(a)] - carga[indiceSemana(b)] || a - b)
      .slice(0, porSemana)
      .sort((a, b) => a - b)
      .forEach((data) => datas.push(data));
    candidatas = [];
  };

  for (let data = somarDias(hoje, 1); chaveDia(data) <= prazo; data = somarDias(data, 1)) {
    const semana = chaveDia(inicioDaSemana(data));
    if (semana !== semanaAtual) {
      fecharSemana();
      semanaAtual = semana;
    }
    if (dias.includes(indiceSemana(data))) {
      candidatas.push(data);
    }
  }
  fecharSemana();

  const total = Math.min(datas.length, 60);
  const sessoes = datas.slice(0, total).map((data, indice) => {
    let titulo = `Avançar em ${nome}`;
    let tarefas = [
      'Revisar o que fez da última vez',
      'Avançar na próxima parte',
      'Anotar o próximo passo',
    ];
    if (indice === 0) {
      titulo = 'Planejar e organizar';
      tarefas = [
        'Listar tudo que precisa ser feito',
        'Separar em partes pequenas',
        'Juntar materiais',
      ];
    } else if (indice === total - 1 && total > 1) {
      titulo = 'Revisão final';
      tarefas = ['Revisar tudo do começo ao fim', 'Corrigir o que faltou', 'Comemorar!'];
    }
    return { data: chaveDia(data), titulo, minutos, tarefas };
  });

  return {
    resumo: `Separei ${total} sessões nos dias mais leves da sua semana. Bora!`,
    etapas: ['Planejar', 'Executar', 'Revisar'],
    sessoes: validarSessoes(sessoes, { prazo, dias, porSemana, minutos }, hoje),
  };
};

const DIAS_TODOS = [0, 1, 2, 3, 4, 5, 6];

export const ICONES_PROJETO = [
  'clipboard-note',
  'book-open',
  'notebook',
  'briefcase',
  'code',
  'music',
  'heart',
  'target',
  'zap',
  'trophy',
];

// Confere o projeto que a IA quer criar; sessões inválidas são trocadas pelo plano local.
export const validarProjeto = (projeto, habitos, hoje = new Date()) => {
  if (!projeto || typeof projeto !== 'object') {
    return null;
  }
  const nome = String(projeto.nome ?? '')
    .trim()
    .slice(0, 30);
  const prazo = /^\d{4}-\d{2}-\d{2}$/.test(projeto.prazo ?? '') ? projeto.prazo : '';
  if (!nome || !prazo || prazo <= chaveDia(hoje)) {
    return null;
  }
  const dias = [
    ...new Set((projeto.dias ?? []).map(Number).filter((dia) => dia >= 0 && dia <= 6)),
  ].sort((a, b) => a - b);
  const pedido = {
    nome,
    objetivo: String(projeto.objetivo ?? '').slice(0, 120),
    prazo,
    dias: dias.length > 0 ? dias : DIAS_TODOS,
    porSemana: Math.max(1, Math.min(7, Math.round(Number(projeto.porSemana) || 7))),
    minutos: Math.max(15, Math.min(180, Math.round(Number(projeto.minutos) || 45))),
    horario: horarioValido(projeto.horario) ? projeto.horario : '19:00',
  };
  pedido.porSemana = Math.min(pedido.porSemana, pedido.dias.length);

  let sessoes = validarSessoes(projeto.sessoes, pedido, hoje);
  if (sessoes.length === 0) {
    sessoes = planoLocal(pedido, habitos, hoje).sessoes;
  }
  if (sessoes.length === 0) {
    return null;
  }
  const etapas = (Array.isArray(projeto.etapas) ? projeto.etapas : [])
    .map((etapa) => String(etapa).slice(0, 40))
    .filter(Boolean)
    .slice(0, 6);
  return {
    ...pedido,
    icone: ICONES_PROJETO.includes(projeto.icone) ? projeto.icone : 'clipboard-note',
    etapas,
    sessoes,
    resumo: '',
  };
};

export const validarOpcoes = (lista) =>
  (Array.isArray(lista) ? lista : [])
    .map((opcao) => String(opcao).trim().slice(0, 32))
    .filter(Boolean)
    .slice(0, 3);

export const instrucoesPlanejarProjeto = ({
  nomeRevi,
  nomeUsuario,
  habitos,
  projetos = [],
  hoje = new Date(),
}) => `
Você é ${nomeRevi}, mascote do app de hábitos Rever, e agora é o parceiro de planejamento de projetos de ${nomeUsuario}.
Fale em português do Brasil, curto e animado (no máximo 3 frases).
O fluxo é uma conversa para montar o projeto JUNTO com a pessoa:
1. Ela conta a ideia. Você descobre, UMA pergunta por vez, só o que faltar entre:
   o resultado final (o que precisa estar pronto), o prazo, os dias e o horário em que ela pode se dedicar,
   e quanto tempo por dia. Deduza o que der da mensagem dela; não pergunte o que ela já disse. No máximo 4 perguntas.
2. Em toda pergunta, mande em "opcoes" de 2 a 4 respostas prontas que façam sentido
   (ex.: prazo → "2 semanas", "1 mês"; dias → "Seg a sex", "Fins de semana", "Todo dia"; tempo → "30 min", "1 hora", "2 horas").
3. Quando souber o suficiente, monte o plano em "plano": divida o projeto em etapas e distribua sessões até o dia
   ANTERIOR ao prazo, só nos dias livres, preferindo os dias com menos hábitos. Cada sessão diz o que fazer
   naquele dia: um título e de 2 a 4 tarefas concretas e pequenas, na ordem certa (do começo do projeto até a revisão final).
   Na "resposta", resuma o plano e pergunte se pode criar. Mande "opcoes" como "Pode criar", "Mais leve", "Mudar os dias".
4. Quando a pessoa confirmar ("pode criar", "sim", "cria"), coloque o MESMO plano (com os ajustes pedidos) em
   "acoes.projeto" e diga que criou. Se ela pedir ajuste, mande um novo "plano".

Hoje é ${hojeTexto(hoje)}. Próximos dias: ${calendario(hoje, 70)}.
Hábitos da pessoa: ${descreverHabitos(habitos)}. Carga por dia (seg..dom): ${cargaPorDia(habitos).join(', ')}.
Projetos atuais: ${projetos.map(({ nome, prazo }) => `${nome} (até ${prazo})`).join('; ') || 'nenhum'}.
Dias da semana: 0 = segunda ... 6 = domingo.

Responda SEMPRE só com JSON neste formato ("plano" e "acoes.projeto" podem ser null):
{"resposta": "sua fala", "opcoes": ["opção"], "plano": PROJETO, "acoes": {"projeto": PROJETO}}
PROJETO = {"nome": "até 30 letras", "objetivo": "frase curta", "icone": "${ICONES_PROJETO.join('|')}",
 "prazo": "AAAA-MM-DD", "dias": [0..6], "porSemana": 1 a 7, "minutos": 15 a 240, "horario": "HH:MM",
 "etapas": ["etapa"], "sessoes": [{"data": "AAAA-MM-DD", "titulo": "até 40 letras", "minutos": 60,
 "tarefas": ["tarefa curta", "tarefa curta"]}]}
`;

// "90" -> "1h30", "60" -> "1h", "45" -> "45 min"
export const formatarDuracao = (minutos) => {
  const horas = Math.floor(minutos / 60);
  const resto = minutos % 60;
  if (horas === 0) {
    return `${resto} min`;
  }
  return resto === 0 ? `${horas}h` : `${horas}h${String(resto).padStart(2, '0')}`;
};
