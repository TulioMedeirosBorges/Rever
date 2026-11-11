import { cores } from '../styles/tema';

// Cada cor tem o tom do corpo (#) e o da sombra (d). `nivel` é o nível que libera a opção.
export const coresRevi = [
  { id: 'creme', nome: 'Creme', corpo: cores.creme, sombra: '#c2ab82', nivel: 1 },
  { id: 'turquesa', nome: 'Turquesa', corpo: cores.turquesa, sombra: '#22706e', nivel: 1 },
  { id: 'laranja', nome: 'Laranja', corpo: cores.laranja, sombra: '#a8571c', nivel: 2 },
  { id: 'vermelho', nome: 'Vermelho', corpo: cores.vermelho, sombra: '#962820', nivel: 3 },
  { id: 'amarelo', nome: 'Dourado', corpo: cores.amarelo, sombra: '#9c7417', nivel: 4 },
  { id: 'fantasma', nome: 'Fantasma', corpo: '#fbf4e6', sombra: '#a9a3b8', nivel: 6 },
];

const linha = (numero, colunas, tipo) => colunas.map((coluna) => [numero, coluna, tipo]);
const intervalo = (de, ate) => Array.from({ length: ate - de + 1 }, (_, i) => de + i);

// Pixels desenhados nas 4 linhas acima da cabeça (e nas laterais, no caso do fone).
export const acessoriosRevi = [
  {
    id: 'estrela',
    nome: 'Antena',
    nivel: 1,
    pixels: [
      ...linha(0, [6, 7], 'y'),
      ...linha(1, [5, 6, 7, 8], 'y'),
      ...linha(2, [6, 7], 'y'),
      ...linha(3, [6, 7], 'd'),
    ],
  },
  { id: 'nenhum', nome: 'Nada', nivel: 1, pixels: [] },
  {
    id: 'laco',
    nome: 'Laço',
    nivel: 2,
    pixels: [
      ...linha(1, [3, 4, 9, 10], 'r'),
      ...linha(2, [3, 4, 5, 8, 9, 10], 'r'),
      ...linha(2, [6, 7], 'R'),
      ...linha(3, [3, 4, 9, 10], 'r'),
    ],
  },
  {
    id: 'fone',
    nome: 'Fone',
    nivel: 3,
    pixels: [
      ...linha(3, intervalo(3, 10), 'p'),
      ...linha(4, [2, 11], 'p'),
      ...linha(5, [1, 12], 'p'),
      ...linha(6, [0, 13], 'p'),
      ...linha(7, [0, 13], 'r'),
      ...linha(8, [0, 13], 'r'),
      ...linha(9, [0, 13], 'R'),
    ],
  },
  {
    id: 'cartola',
    nome: 'Cartola',
    nivel: 4,
    pixels: [
      ...linha(0, intervalo(4, 9), 'p'),
      ...linha(1, intervalo(4, 9), 'p'),
      ...linha(2, intervalo(4, 9), 'r'),
      ...linha(3, intervalo(2, 11), 'p'),
    ],
  },
  {
    id: 'coroa',
    nome: 'Coroa',
    nivel: 5,
    pixels: [
      ...linha(1, [3, 6, 7, 10], 'y'),
      ...linha(2, intervalo(3, 10), 'y'),
      ...linha(3, intervalo(3, 10), 'y'),
      ...linha(3, [6, 7], 'r'),
    ],
  },
];

// Óculos escuros por cima dos olhos.
export const oculosRevi = {
  nivel: 2,
  pixels: [
    ...linha(6, intervalo(2, 11), 'k'),
    ...linha(7, [2, 3, 4, 5, 8, 9, 10, 11], 'k'),
    ...linha(8, [3, 4, 9, 10], 'k'),
    ...linha(7, [3, 9], 'w'),
  ],
};

export const reviInicial = { nome: 'Revi', cor: 'creme', acessorio: 'estrela', oculos: false };
