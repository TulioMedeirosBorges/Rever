import { cores } from "../styles/tema";
import { chaveDia, indiceSemana, paraHorario, somarDias } from "../utils/datas";

// Conta de demonstração: mostra tudo o que o app faz. Os dados são gerados a partir de hoje
// (a sequência está em dia, há sessão de projeto hoje etc.) e são recriados a cada login.
export const CONTA_DEMO = {
  nome: "Demo",
  email: "demo@rever.app",
  senha: "rever123",
};

const TODOS = [0, 1, 2, 3, 4, 5, 6];
const UTEIS = [0, 1, 2, 3, 4];

const criarHabitos = (agora) => {
  // "Alongar" fica com o horário 40 min atrás e 15 min de tolerância: aparece como atrasado,
  // para mostrar o aviso e o popup do Revi triste.
  const minutos = agora.getHours() * 60 + agora.getMinutes();
  const alongar = minutos >= 60 ? paraHorario(minutos - 40) : "23:30";

  return [
    {
      id: 1,
      nome: "Beber água",
      icone: "bottle-wine",
      categoria: "Saúde",
      frequencia: TODOS,
      lembrete: "08:00",
      repetir: 2,
      ate: "20:00",
      tolerancia: 60,
    },
    {
      id: 2,
      nome: "Meditar",
      icone: "sparkle",
      categoria: "Bem-estar",
      frequencia: UTEIS,
      lembrete: "07:00",
      repetir: 0,
      ate: "",
      tolerancia: 15,
    },
    {
      id: 3,
      nome: "Estudar inglês",
      icone: "notebook",
      categoria: "Estudos",
      frequencia: UTEIS,
      lembrete: "14:00",
      repetir: 0,
      ate: "",
      tolerancia: 30,
    },
    {
      id: 4,
      nome: "Exercitar",
      icone: "fire",
      categoria: "Saúde",
      frequencia: [0, 2, 4],
      lembrete: "18:30",
      repetir: 0,
      ate: "",
      tolerancia: 30,
    },
    {
      id: 5,
      nome: "Ler 20 páginas",
      icone: "book-open",
      categoria: "Estudos",
      frequencia: TODOS,
      lembrete: "21:00",
      repetir: 0,
      ate: "",
      tolerancia: 30,
    },
    {
      id: 6,
      nome: "Ouvir música",
      icone: "headphone",
      categoria: "Lazer",
      frequencia: [5, 6],
      lembrete: "17:00",
      repetir: 0,
      ate: "",
      tolerancia: 60,
    },
    {
      id: 7,
      nome: "Alongar",
      icone: "heart",
      categoria: "Bem-estar",
      frequencia: TODOS,
      lembrete: alongar,
      repetir: 0,
      ate: "",
      tolerancia: 15,
    },
  ];
};

// 3 semanas de histórico: quase tudo feito (alguns deslizes), para ter sequência longa,
// dias perfeitos e XP suficiente para liberar a personalização do Revi.
const criarHistorico = (habitos, agora) => {
  const historico = {};
  for (let dias = 21; dias >= 1; dias -= 1) {
    const data = somarDias(agora, -dias);
    historico[chaveDia(data)] = habitos
      .filter(({ frequencia }) => frequencia.includes(indiceSemana(data)))
      .filter(({ id }) => (id * 7 + dias) % 9 !== 0)
      .map(({ id }) => id);
  }
  // Hoje: água e meditação já feitas.
  historico[chaveDia(agora)] = habitos
    .filter(
      ({ id, frequencia }) =>
        [1, 2].includes(id) && frequencia.includes(indiceSemana(agora)),
    )
    .map(({ id }) => id);
  return historico;
};

const sessoesNosDias = (agora, de, ate, dias, criar) => {
  const sessoes = [];
  for (let distancia = de; distancia <= ate; distancia += 1) {
    const data = somarDias(agora, distancia);
    if (dias.includes(indiceSemana(data))) {
      sessoes.push(criar(chaveDia(data), distancia, sessoes.length));
    }
  }
  return sessoes;
};

const criarProjetos = (agora) => {
  const etapasCalculo = [
    [
      "Limites",
      [
        "Revisar a teoria de limites",
        "Resolver 5 exercícios",
        "Anotar dúvidas",
      ],
    ],
    [
      "Derivadas",
      [
        "Regras do produto e quociente",
        "Praticar 6 derivadas",
        "Conferir respostas",
      ],
    ],
    ["Regra da cadeia", ["Ver 2 exemplos resolvidos", "Resolver 4 exercícios"]],
    ["Integrais", ["Integrais imediatas", "Resolver lista 3"]],
    ["Simulado", ["Fazer a prova antiga", "Corrigir e revisar os erros"]],
  ];
  // Sessões até a véspera da prova: as que já passaram estão feitas; a de hoje está pela metade.
  const calculo = sessoesNosDias(
    agora,
    -6,
    9,
    UTEIS,
    (data, distancia, indice) => {
      const [titulo, tarefas] = etapasCalculo[indice % etapasCalculo.length];
      const passou = distancia < 0;
      return {
        id: `s${indice + 1}`,
        data,
        titulo,
        minutos: 90,
        tarefas,
        tarefasFeitas: passou
          ? tarefas.map((_, i) => i)
          : distancia === 0
            ? [0]
            : [],
        feita: passou,
      };
    },
  );

  const portfolio = sessoesNosDias(
    agora,
    -7,
    30,
    [5, 6],
    (data, distancia, indice) => ({
      id: `s${indice + 1}`,
      data,
      titulo: [
        "Escolher os projetos",
        "Tirar prints e gravar",
        "Escrever os textos",
        "Montar o site",
      ][indice % 4],
      minutos: 120,
      tarefas: [
        "Separar o material",
        "Fazer a parte do dia",
        "Anotar o próximo passo",
      ],
      tarefasFeitas: distancia < 0 ? [0, 1, 2] : [],
      feita: distancia < 0,
    }),
  );

  return [
    {
      id: "p-demo-1",
      nome: "Prova de Cálculo",
      objetivo: "Passar na prova de Cálculo I",
      icone: "book-open",
      cor: cores.turquesa,
      prazo: chaveDia(somarDias(agora, 10)),
      horario: "19:00",
      tolerancia: 30,
      dias: UTEIS,
      porSemana: 5,
      minutos: 90,
      etapas: etapasCalculo.map(([titulo]) => titulo),
      resumo: "Plano até a véspera da prova, nos dias úteis. Bora arrasar!",
      sessoes: calculo,
      criadoEm: chaveDia(somarDias(agora, -7)),
    },
    {
      id: "p-demo-2",
      nome: "Portfólio",
      objetivo: "Publicar meu site com 3 projetos",
      icone: "code",
      cor: cores.laranja,
      prazo: chaveDia(somarDias(agora, 31)),
      horario: "10:00",
      tolerancia: 60,
      dias: [5, 6],
      porSemana: 2,
      minutos: 120,
      etapas: ["Escolher", "Produzir", "Publicar"],
      resumo: "Fins de semana com calma, 2 horas por vez.",
      sessoes: portfolio,
      criadoEm: chaveDia(somarDias(agora, -8)),
    },
  ];
};

const criarConversas = (agora) => {
  const antes = (dias) => somarDias(agora, -dias).toISOString();
  return {
    conversas: {
      rotina: [
        { id: "d1", papel: "pessoa", texto: "quero dormir às 23h" },
        {
          id: "d2",
          papel: "revi",
          texto:
            "Boa! Preparei passos pequenos pra relaxar e pegar no sono às 23h.",
          opcoes: ["Pode criar tudo", "Mais leve", "Outro horário"],
          habitos: [
            {
              nome: "Desligar telas",
              icone: "moon",
              categoria: "Bem-estar",
              frequencia: TODOS,
              lembrete: "22:00",
              repetir: 0,
              ate: "",
              tolerancia: 30,
            },
            {
              nome: "Deitar",
              icone: "moon",
              categoria: "Bem-estar",
              frequencia: TODOS,
              lembrete: "23:00",
              repetir: 0,
              ate: "",
              tolerancia: 15,
            },
          ],
        },
      ],
      projeto: [],
    },
    arquivo: {
      rotina: [
        {
          id: "a1",
          titulo: "quero beber mais água",
          data: antes(5),
          mensagens: [
            {
              id: "a1-1",
              papel: "pessoa",
              texto: "quero beber mais água, pode criar",
            },
            {
              id: "a1-2",
              papel: "revi",
              texto: "Feito! Criei um lembrete a cada 2h, das 8h às 20h.",
              criado: {
                habitos: [
                  {
                    id: 1,
                    nome: "Beber água",
                    icone: "bottle-wine",
                    frequencia: TODOS,
                    lembrete: "08:00",
                    repetir: 2,
                  },
                ],
                projeto: null,
              },
            },
          ],
        },
      ],
      projeto: [
        {
          id: "a2",
          titulo: "tenho prova de cálculo daqui 10 dias",
          data: antes(7),
          mensagens: [
            {
              id: "a2-1",
              papel: "pessoa",
              texto: "tenho prova de cálculo daqui 10 dias",
            },
            {
              id: "a2-2",
              papel: "revi",
              texto: "Bora! Quais dias você pode estudar?",
            },
            { id: "a2-3", papel: "pessoa", texto: "seg a sex, 1h30 às 19h" },
            {
              id: "a2-4",
              papel: "revi",
              texto:
                "Prontinho! Criei o projeto com as sessões até a véspera da prova.",
              criado: {
                habitos: [],
                projeto: {
                  id: "p-demo-1",
                  nome: "Prova de Cálculo",
                  sessoes: 12,
                  ultima: chaveDia(somarDias(agora, 9)),
                  horario: "19:00",
                },
              },
            },
          ],
        },
      ],
    },
  };
};

// Dados completos da conta de demonstração, no mesmo formato que o app salva.
export const criarDadosDemo = (agora = new Date()) => {
  const habitos = criarHabitos(agora);
  return {
    habitos,
    historico: criarHistorico(habitos, agora),
    usuario: {
      nome: CONTA_DEMO.nome,
      email: CONTA_DEMO.email,
      avatar: "robot-face-happy",
      cor: cores.amarelo,
      membroDesde: chaveDia(somarDias(agora, -30)),
    },
    revi: {
      nome: "Revi",
      cor: "turquesa",
      acessorio: "coroa",
      rosto: "oculos",
    },
    foco: { sessoes: 9, minutos: 240 },
    config: { sons: true, chaveGemini: "" },
    projetos: criarProjetos(agora),
    adiamentos: {},
    pulados: {},
    ...criarConversas(agora),
  };
};
