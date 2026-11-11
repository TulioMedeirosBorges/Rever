import Svg, { Path } from 'react-native-svg';
import icones from 'pixelarticons/fonts/pixelart-icons-font.json';

export default function IconePixel({ nome, tamanho = 24, cor = '#000000', style }) {
  const caminhos = icones[nome] ?? [];

  return (
    <Svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill={cor} style={style}>
      {caminhos.map((caminho) => (
        <Path key={caminho} d={caminho} />
      ))}
    </Svg>
  );
}
