// Paleta derivada da logo: fundo escuro, letras creme e a faixa de 5 cores.
const logo = {
  fundo: '#181722',
  creme: '#f4dfb5',
  vermelho: '#df3d32',
  laranja: '#eb8232',
  amarelo: '#e0ab2f',
  turquesa: '#36a3a0',
  petroleo: '#126d80',
};

export const cores = {
  ...logo,
  arcoIris: [logo.vermelho, logo.laranja, logo.amarelo, logo.turquesa, logo.petroleo],

  // superfícies: tons do próprio fundo da logo
  cartao: '#221f30',
  cartaoDestaque: '#2e2a42',
  sombra: '#0e0d15',
  barra: '#221f30',
  trilha: '#3a3550',

  // texto
  branco: '#fbf4e6',
  cinza: '#7f7891',
  cinzaClaro: '#cbc2b1',
  preto: logo.fundo,
  placeholder: '#8c8272',

  // papéis de cada cor
  principal: logo.creme,
  sucesso: logo.turquesa,
  perigo: logo.vermelho,
  link: logo.amarelo,
  hoje: logo.laranja,
};

export const fontes = {
  regular: 'BitcountPropSingle_500Medium',
  media: 'BitcountPropSingle_600SemiBold',
  negrito: 'BitcountPropSingle_800ExtraBold',
  semLigaduras: ['no-common-ligatures'],
};

export const espacos = {
  pequeno: 8,
  medio: 16,
  grande: 24,
};
