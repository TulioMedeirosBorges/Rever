import { cores } from "../styles/tema";

// Cada cor tem o tom do corpo (#) e o da sombra (d). `nivel` é o nível que libera a opção.
// A "arco" é especial: o corpo vira listras com as cores da logo.
export const coresRevi = [
  {
    id: "creme",
    nome: "Creme",
    corpo: cores.creme,
    sombra: "#c2ab82",
    nivel: 1,
  },
  {
    id: "turquesa",
    nome: "Turquesa",
    corpo: cores.turquesa,
    sombra: "#22706e",
    nivel: 1,
  },
  {
    id: "laranja",
    nome: "Laranja",
    corpo: cores.laranja,
    sombra: "#a8571c",
    nivel: 2,
  },
  {
    id: "vermelho",
    nome: "Vermelho",
    corpo: cores.vermelho,
    sombra: "#962820",
    nivel: 3,
  },
  {
    id: "amarelo",
    nome: "Dourado",
    corpo: cores.amarelo,
    sombra: "#9c7417",
    nivel: 4,
  },
  {
    id: "petroleo",
    nome: "Petróleo",
    corpo: "#1b8aa0",
    sombra: "#0f5563",
    nivel: 5,
  },
  {
    id: "fantasma",
    nome: "Fantasma",
    corpo: "#fbf4e6",
    sombra: "#a9a3b8",
    nivel: 6,
  },
  { id: "noite", nome: "Noite", corpo: "#4a4468", sombra: "#2e2a42", nivel: 7 },
  {
    id: "arco",
    nome: "Arco-íris",
    corpo: cores.vermelho,
    sombra: "#0f5563",
    nivel: 8,
    listras: cores.arcoIris,
  },
];

const linha = (numero, colunas, tipo) =>
  colunas.map((coluna) => [numero, coluna, tipo]);
const intervalo = (de, ate) =>
  Array.from({ length: ate - de + 1 }, (_, i) => de + i);

// Pixels desenhados nas 4 linhas acima da cabeça (e nas laterais, no caso do fone).
// Tipos de pixel: y amarelo, r/R vermelho, p petróleo, w branco, T turquesa, l/L laranja, d sombra.
export const acessoriosRevi = [
  {
    id: "estrela",
    nome: "Antena",
    nivel: 1,
    pixels: [
      ...linha(0, [6, 7], "y"),
      ...linha(1, [5, 6, 7, 8], "y"),
      ...linha(2, [6, 7], "y"),
      ...linha(3, [6, 7], "d"),
    ],
  },
  { id: "nenhum", nome: "Nada", nivel: 1, pixels: [] },
  {
    id: "broto",
    nome: "Broto",
    nivel: 1,
    pixels: [
      ...linha(0, [4, 5, 8, 9], "T"),
      ...linha(1, [5, 6, 7, 8], "T"),
      ...linha(2, [6, 7], "d"),
      ...linha(3, [6, 7], "d"),
    ],
  },
  {
    id: "laco",
    nome: "Laço",
    nivel: 2,
    pixels: [
      ...linha(1, [3, 4, 9, 10], "r"),
      ...linha(2, [3, 4, 5, 8, 9, 10], "r"),
      ...linha(2, [6, 7], "R"),
      ...linha(3, [3, 4, 9, 10], "r"),
    ],
  },
  {
    id: "bone",
    nome: "Boné",
    nivel: 2,
    pixels: [
      ...linha(1, intervalo(5, 8), "l"),
      ...linha(2, intervalo(4, 9), "l"),
      ...linha(3, intervalo(3, 10), "l"),
      ...linha(3, [11, 12, 13], "L"),
      ...linha(2, [6], "w"),
    ],
  },
  {
    id: "fone",
    nome: "Fone",
    nivel: 3,
    pixels: [
      ...linha(3, intervalo(3, 10), "p"),
      ...linha(4, [2, 11], "p"),
      ...linha(5, [1, 12], "p"),
      ...linha(6, [0, 13], "p"),
      ...linha(7, [0, 13], "r"),
      ...linha(8, [0, 13], "r"),
      ...linha(9, [0, 13], "R"),
    ],
  },
  {
    id: "gorro",
    nome: "Gorro",
    nivel: 3,
    pixels: [
      ...linha(0, [6, 7], "w"),
      ...linha(1, intervalo(5, 8), "r"),
      ...linha(2, intervalo(4, 9), "r"),
      ...linha(3, intervalo(3, 10), "r"),
      ...linha(4, intervalo(3, 10), "R"),
    ],
  },
  {
    id: "faixa",
    nome: "Faixa",
    nivel: 4,
    pixels: [
      ...linha(5, intervalo(2, 11), "r"),
      [5, 12, "R"],
      [6, 13, "R"],
      [4, 12, "R"],
    ],
  },
  {
    id: "cartola",
    nome: "Cartola",
    nivel: 4,
    pixels: [
      ...linha(0, intervalo(4, 9), "p"),
      ...linha(1, intervalo(4, 9), "p"),
      ...linha(2, intervalo(4, 9), "r"),
      ...linha(3, intervalo(2, 11), "p"),
    ],
  },
  {
    id: "coroa",
    nome: "Coroa",
    nivel: 5,
    pixels: [
      ...linha(1, [3, 6, 7, 10], "y"),
      ...linha(2, intervalo(3, 10), "y"),
      ...linha(3, intervalo(3, 10), "y"),
      ...linha(3, [6, 7], "r"),
    ],
  },
  {
    id: "mago",
    nome: "Mago",
    nivel: 6,
    pixels: [
      [0, 8, "p"],
      ...linha(1, [6, 7, 8], "p"),
      ...linha(2, intervalo(5, 9), "p"),
      [2, 7, "y"],
      ...linha(3, intervalo(2, 11), "p"),
    ],
  },
  {
    id: "aureola",
    nome: "Auréola",
    nivel: 7,
    pixels: [
      ...linha(0, intervalo(5, 8), "y"),
      ...linha(1, [4, 9], "y"),
      ...linha(2, intervalo(5, 8), "y"),
    ],
  },
];

// Rosto: o que vai por cima dos olhos e da boca.
export const rostosRevi = [
  { id: "nenhum", nome: "Nada", nivel: 1, pixels: [] },
  {
    id: "nerd",
    nome: "Nerd",
    nivel: 1,
    pixels: [
      ...linha(6, [2, 3, 4, 5, 8, 9, 10, 11], "k"),
      ...linha(7, [2, 5, 6, 7, 8, 11], "k"),
      ...linha(8, [2, 3, 4, 5, 8, 9, 10, 11], "k"),
    ],
  },
  {
    id: "oculos",
    nome: "Escuros",
    nivel: 2,
    pixels: [
      ...linha(6, intervalo(2, 11), "k"),
      ...linha(7, [2, 3, 4, 5, 8, 9, 10, 11], "k"),
      ...linha(8, [3, 4, 9, 10], "k"),
      ...linha(7, [3, 9], "w"),
    ],
  },
  {
    id: "bigode",
    nome: "Bigode",
    nivel: 3,
    pixels: [...linha(9, intervalo(4, 9), "k"), [10, 3, "k"], [10, 10, "k"]],
  },
  {
    id: "pirata",
    nome: "Pirata",
    nivel: 4,
    pixels: [
      ...linha(6, [2, 3, 4, 5, 6, 7], "k"),
      ...linha(6, [8, 9, 10, 11], "k"),
      ...linha(7, [8, 9, 10, 11], "k"),
      ...linha(8, [9, 10], "k"),
    ],
  },
  {
    id: "monoculo",
    nome: "Monóculo",
    nivel: 6,
    pixels: [
      ...linha(6, [9, 10], "y"),
      ...linha(7, [8, 11], "y"),
      ...linha(8, [8, 11], "y"),
      ...linha(9, [9, 10, 11], "y"),
      [10, 11, "y"],
      [11, 12, "y"],
    ],
  },
];

export const reviInicial = {
  nome: "Revi",
  cor: "creme",
  acessorio: "estrela",
  rosto: "nenhum",
};

// Quem salvou antes desta versão tinha só "óculos sim/não".
export const rostoDe = (revi) =>
  revi?.rosto ?? (revi?.oculos ? "oculos" : "nenhum");
