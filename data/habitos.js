import { chaveDia, indiceSemana, somarDias } from '../utils/datas';

export const habitos = [
  {
    id: 1,
    nome: 'Beber Água',
    icone: 'bottle-wine',
    categoria: 'Saúde',
    frequencia: [0, 1, 2, 3, 4, 5, 6],
    lembrete: '08:00',
    repetir: 2,
    ate: '20:00',
  },
  {
    id: 2,
    nome: 'Ler um Livro',
    icone: 'book-open',
    categoria: 'Estudos',
    frequencia: [0, 2, 4],
    lembrete: '21:00',
    repetir: 0,
    ate: '',
  },
  {
    id: 3,
    nome: 'Exercitar',
    icone: 'fire',
    categoria: 'Saúde',
    frequencia: [0, 2, 4],
    lembrete: '19:00',
    repetir: 0,
    ate: '',
  },
  {
    id: 4,
    nome: 'Meditar',
    icone: 'sparkle',
    categoria: 'Bem-estar',
    frequencia: [0, 1, 2, 3, 4],
    lembrete: '07:00',
    repetir: 0,
    ate: '',
  },
  {
    id: 5,
    nome: 'Estudar',
    icone: 'notebook',
    categoria: 'Estudos',
    frequencia: [0, 1, 2, 3, 4],
    lembrete: '14:00',
    repetir: 0,
    ate: '',
  },
  {
    id: 6,
    nome: 'Escutar Música',
    icone: 'headphone',
    categoria: 'Lazer',
    frequencia: [5, 6],
    lembrete: '18:00',
    repetir: 0,
    ate: '',
  },
];

// Histórico de exemplo dos últimos dias, para o app não começar vazio.
export const criarHistoricoInicial = (hoje = new Date()) => {
  const historico = { [chaveDia(hoje)]: [1, 2] };

  for (let dias = 1; dias <= 9; dias += 1) {
    const data = somarDias(hoje, -dias);
    historico[chaveDia(data)] = habitos
      .filter(
        ({ id, frequencia }) => frequencia.includes(indiceSemana(data)) && (id + dias) % 4 !== 0,
      )
      .map(({ id }) => id);
  }
  return historico;
};

export const usuarioInicial = {
  nome: 'Usuário',
  email: 'usuario@email.com',
  avatar: 'user',
  cor: '#36a3a0',
  membroDesde: '2026-11-01',
};
