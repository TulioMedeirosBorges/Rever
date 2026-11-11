import Apple from '../assets/Icon Propio/Apple pixel art.svg';
import Calendario from '../assets/Icon Propio/Calendario.svg';
import Casa from '../assets/Icon Propio/Casa.svg';
import Google from '../assets/Icon Propio/Google pixelArt.svg';
import Mais from '../assets/Icon Propio/botao com mais da barra.svg';
import Roda from '../assets/Icon Propio/Roda da porcentagem.svg';
import Trofeu from '../assets/Icon Propio/trofeu.svg';
import Usuario from '../assets/Icon Propio/Usuario.svg';

const icones = {
  apple: Apple,
  calendario: Calendario,
  casa: Casa,
  google: Google,
  mais: Mais,
  roda: Roda,
  trofeu: Trofeu,
  usuario: Usuario,
};

export default function IconeProprio({ nome, tamanho = 24, cor = '#ffffff', style }) {
  const Icone = icones[nome];

  if (!Icone) {
    return null;
  }

  return <Icone width={tamanho} height={tamanho} color={cor} style={style} />;
}
