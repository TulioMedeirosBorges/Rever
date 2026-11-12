import { paraHorario, paraMinutos } from './datas';

// Quanto tempo a pessoa pode atrasar para começar uma atividade (em minutos).
export const TOLERANCIAS = [
  { minutos: 0, rotulo: 'Na hora' },
  { minutos: 15, rotulo: '15 min' },
  { minutos: 30, rotulo: '30 min' },
  { minutos: 60, rotulo: '1 h' },
  { minutos: 120, rotulo: '2 h' },
];
export const TOLERANCIA_PADRAO = 30;

// O aviso de "prazo acabando" chega quando faltam estes minutos para o limite.
export const ANTECEDENCIA_AVISO = 10;

export const toleranciaDe = (item) => item?.tolerancia ?? TOLERANCIA_PADRAO;

// Chaves que identificam um item do dia (para adiar só ele, só hoje).
export const chaveHabito = (habito) => `h${habito.id}`;
export const chaveSessao = (projeto, sessao) => `s${projeto.id}-${sessao.id}`;

// Horário que vale hoje: o adiado (se houver) ou o original.
export const horarioDoDia = (horarioOriginal, adiamentosDoDia, chave) =>
  adiamentosDoDia?.[chave] ?? horarioOriginal ?? '';

export const horarioLimite = (horario, tolerancia) =>
  horario ? paraHorario(Math.min(paraMinutos(horario) + tolerancia, 23 * 60 + 59)) : '';

// Minuto (do dia) em que o aviso de prazo deve chegar; null se não tiver aviso.
export const minutoDoAviso = (horario, tolerancia) => {
  if (!horario || tolerancia <= 0) {
    return null;
  }
  const inicio = paraMinutos(horario);
  return Math.max(inicio, inicio + tolerancia - ANTECEDENCIA_AVISO);
};

// Situação de uma atividade agora:
// 'antes' (ainda não é a hora), 'janela' (pode começar), 'acabando' (faltam poucos minutos),
// 'atrasado' (passou do limite) ou null (sem horário).
export const situacaoDoPrazo = ({ horario, tolerancia, agoraMinutos }) => {
  if (!horario) {
    return null;
  }
  const inicio = paraMinutos(horario);
  const limite = inicio + tolerancia;
  if (agoraMinutos < inicio) {
    return 'antes';
  }
  if (agoraMinutos > limite) {
    return 'atrasado';
  }
  return limite - agoraMinutos <= ANTECEDENCIA_AVISO ? 'acabando' : 'janela';
};

// Novo horário ao adiar: a partir de agora (ou do horário, se ainda não chegou), arredondado a 5 min.
export const horarioAdiado = (horarioAtual, agoraMinutos, minutosAMais) => {
  const base = Math.max(agoraMinutos, horarioAtual ? paraMinutos(horarioAtual) : 0);
  const novo = Math.ceil((base + minutosAMais) / 5) * 5;
  return paraHorario(Math.min(novo, 23 * 60 + 55));
};
