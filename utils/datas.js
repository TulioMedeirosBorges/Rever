const doisDigitos = (numero) => String(numero).padStart(2, '0');

export const chaveDia = (data) =>
  `${data.getFullYear()}-${doisDigitos(data.getMonth() + 1)}-${doisDigitos(data.getDate())}`;

export const somarDias = (data, dias) => {
  const nova = new Date(data);
  nova.setDate(nova.getDate() + dias);
  return nova;
};

// 0 = segunda ... 6 = domingo (mesma ordem de data/semana.js)
export const indiceSemana = (data) => (data.getDay() + 6) % 7;

export const inicioDaSemana = (data) => somarDias(data, -indiceSemana(data));

export const nomesMeses = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro',
];

export const paraMinutos = (horario) => {
  const [hora, minuto] = horario.split(':').map(Number);
  return hora * 60 + minuto;
};

export const paraHorario = (minutos) =>
  `${doisDigitos(Math.floor(minutos / 60))}:${doisDigitos(minutos % 60)}`;

// Lista os horários de um lembrete: o inicial e, se recorrente, um a cada `repetir` horas até `ate`.
export const horariosDoLembrete = ({ lembrete, repetir = 0, ate = '' }) => {
  if (!lembrete) {
    return [];
  }
  if (!repetir || !ate) {
    return [lembrete];
  }
  const fim = paraMinutos(ate);
  const horarios = [];
  for (let minuto = paraMinutos(lembrete); minuto <= fim; minuto += repetir * 60) {
    horarios.push(paraHorario(minuto));
  }
  return horarios;
};
