import { chaveDia, indiceSemana, inicioDaSemana, somarDias } from "./datas";

export const XP_POR_HABITO = 10;
export const XP_DIA_PERFEITO = 20;
export const XP_POR_NIVEL = 100;
export const XP_POR_FOCO = 15;

// Um hábito só conta a partir do dia em que foi criado: criar um hábito novo não pode
// "estragar" os dias perfeitos (nem o XP) que já passaram.
const agendadosNoDia = (habitos, data) =>
  habitos.filter(
    ({ frequencia, criadoEm }) =>
      frequencia.includes(indiceSemana(data)) &&
      (!criadoEm || criadoEm <= chaveDia(data)),
  );

const feitosNoDia = (historico, data) => historico[chaveDia(data)] ?? [];

const diaPerfeito = (habitos, historico, data) => {
  const agendados = agendadosNoDia(habitos, data);
  const feitos = feitosNoDia(historico, data);
  return (
    agendados.length > 0 && agendados.every(({ id }) => feitos.includes(id))
  );
};

// Conta dias seguidos com pelo menos um hábito feito, terminando em `data`.
const sequenciaAte = (historico, data) => {
  let dias = 0;
  let dia = data;
  while (feitosNoDia(historico, dia).length > 0) {
    dias += 1;
    dia = somarDias(dia, -1);
  }
  return dias;
};

export function calcularEstatisticas(
  habitos,
  historico,
  foco = { sessoes: 0, minutos: 0 },
  hoje = new Date(),
) {
  const chaves = Object.keys(historico).sort();
  const totalFeitos = chaves.reduce(
    (soma, chave) => soma + historico[chave].length,
    0,
  );

  const datas = chaves.map((chave) => {
    const [ano, mes, dia] = chave.split("-").map(Number);
    return new Date(ano, mes - 1, dia);
  });
  const diasPerfeitos = datas.filter((data) =>
    diaPerfeito(habitos, historico, data),
  ).length;

  // Hoje ainda não feito não quebra a sequência: conta a partir de ontem.
  const sequenciaAtual =
    feitosNoDia(historico, hoje).length > 0
      ? sequenciaAte(historico, hoje)
      : sequenciaAte(historico, somarDias(hoje, -1));
  const melhorSequencia = Math.max(
    sequenciaAtual,
    ...datas.map((data) => sequenciaAte(historico, data)),
  );

  const segunda = inicioDaSemana(hoje);
  const semana = Array.from({ length: 7 }, (_, indice) => {
    const data = somarDias(segunda, indice);
    return {
      data,
      feitos: feitosNoDia(historico, data).length,
      futuro: data > hoje,
    };
  });

  let agendadosNaSemana = 0;
  let feitosNaSemana = 0;
  semana
    .filter(({ futuro }) => !futuro)
    .forEach(({ data }) => {
      const agendados = agendadosNoDia(habitos, data);
      const feitos = feitosNoDia(historico, data);
      agendadosNaSemana += agendados.length;
      feitosNaSemana += agendados.filter(({ id }) =>
        feitos.includes(id),
      ).length;
    });

  const ultimos7 = Array.from({ length: 7 }, (_, dias) =>
    somarDias(hoje, -dias),
  );
  const porHabito = Object.fromEntries(
    habitos.map(({ id, frequencia }) => [
      id,
      {
        feitos: ultimos7.filter((data) =>
          feitosNoDia(historico, data).includes(id),
        ).length,
        meta: frequencia.length,
      },
    ]),
  );

  const xp =
    totalFeitos * XP_POR_HABITO +
    diasPerfeitos * XP_DIA_PERFEITO +
    foco.sessoes * XP_POR_FOCO;

  return {
    totalFeitos,
    diasPerfeitos,
    sequenciaAtual,
    melhorSequencia,
    semana,
    porHabito,
    taxaSemana: agendadosNaSemana > 0 ? feitosNaSemana / agendadosNaSemana : 0,
    xp,
    nivel: Math.floor(xp / XP_POR_NIVEL) + 1,
    xpNoNivel: xp % XP_POR_NIVEL,
    sessoesFoco: foco.sessoes,
    minutosFoco: foco.minutos,
    totalHabitos: habitos.length,
    categorias: new Set(habitos.map(({ categoria }) => categoria)).size,
    recorrentes: habitos.filter(({ repetir }) => repetir > 0).length,
    madrugador: habitos.some(
      ({ lembrete }) => lembrete !== "" && lembrete < "07:00",
    ),
  };
}

// Totais por período para o gráfico de Progresso.
export function dadosDoGrafico(historico, periodo, hoje = new Date()) {
  const contar = (data) => (historico[chaveDia(data)] ?? []).length;

  if (periodo === "sem") {
    const segunda = inicioDaSemana(hoje);
    return ["SEG", "TER", "QUA", "QUI", "SEX", "SAB", "DOM"].map(
      (rotulo, indice) => ({
        rotulo,
        valor: contar(somarDias(segunda, indice)),
      }),
    );
  }

  if (periodo === "mês") {
    const segunda = inicioDaSemana(hoje);
    return [3, 2, 1, 0].map((semanasAtras, indice) => {
      const inicio = somarDias(segunda, -7 * semanasAtras);
      const valor = Array.from({ length: 7 }, (_, dia) =>
        contar(somarDias(inicio, dia)),
      ).reduce((soma, atual) => soma + atual, 0);
      return { rotulo: `S${indice + 1}`, valor };
    });
  }

  const ano = hoje.getFullYear();
  return "JFMAMJJASOND".split("").map((rotulo, mes) => ({
    rotulo,
    valor: Object.entries(historico)
      .filter(([chave]) =>
        chave.startsWith(`${ano}-${String(mes + 1).padStart(2, "0")}`),
      )
      .reduce((soma, [, feitos]) => soma + feitos.length, 0),
  }));
}
