// Ritmo das animações: tudo entra numa grade de "batidas", um elemento depois do outro.
export const BATIDA = 60;

// Molas (física, não curvas lineares). Quanto menor o atrito, mais o elemento "quica".
export const molas = {
  suave: { friction: 9, tension: 70 },
  viva: { friction: 7, tension: 110 },
  quique: { friction: 4.5, tension: 120 },
};

// Atraso de um elemento na grade, com teto para listas longas não demorarem.
export const naBatida = (ordem, maximo = 10) => Math.min(ordem, maximo) * BATIDA;
