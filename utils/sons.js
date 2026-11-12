import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';

const arquivos = {
  toque: require('../assets/sons/toque.wav'),
  navegar: require('../assets/sons/navegar.wav'),
  marcar: require('../assets/sons/marcar.wav'),
  desmarcar: require('../assets/sons/desmarcar.wav'),
  erro: require('../assets/sons/erro.wav'),
  conquista: require('../assets/sons/conquista.wav'),
  nivel: require('../assets/sons/nivel.wav'),
  reviPulo: require('../assets/sons/revi_pulo.wav'),
  reviFeliz: require('../assets/sons/revi_feliz.wav'),
  reviRadiante: require('../assets/sons/revi_radiante.wav'),
  reviNeutro: require('../assets/sons/revi_neutro.wav'),
  reviSono: require('../assets/sons/revi_sono.wav'),
  reviTriste: require('../assets/sons/revi_triste.wav'),
  reviFala1: require('../assets/sons/revi_fala1.wav'),
  reviFala2: require('../assets/sons/revi_fala2.wav'),
  reviFala3: require('../assets/sons/revi_fala3.wav'),
  logoRisco: require('../assets/sons/logo_risco.wav'),
  logoLetra1: require('../assets/sons/logo_letra1.wav'),
  logoLetra2: require('../assets/sons/logo_letra2.wav'),
  logoLetra3: require('../assets/sons/logo_letra3.wav'),
  logoLetra4: require('../assets/sons/logo_letra4.wav'),
  logoLetra5: require('../assets/sons/logo_letra5.wav'),
  logoBrilho: require('../assets/sons/logo_brilho.wav'),
  focoInicio: require('../assets/sons/foco_inicio.wav'),
  focoFim: require('../assets/sons/foco_fim.wav'),
};

const VOLUME = 0.6;
const players = {};
let ligados = true;

// Efeitos curtos: tocam junto com outros apps e respeitam o modo silencioso do iPhone.
setAudioModeAsync({ playsInSilentMode: false, interruptionMode: 'mixWithOthers' }).catch(() => {});

export const definirSonsLigados = (valor) => {
  ligados = valor;
};

// Cada som tem um player só, criado no primeiro uso e reaproveitado.
export function tocar(nome) {
  if (!ligados || !arquivos[nome]) {
    return;
  }
  try {
    if (!players[nome]) {
      players[nome] = createAudioPlayer(arquivos[nome]);
      players[nome].volume = VOLUME;
    }
    const player = players[nome];
    player.seekTo(0).catch(() => {});
    player.play();
  } catch {
    // Sem som não é motivo para travar o app.
  }
}
