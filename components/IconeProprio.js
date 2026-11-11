import { StyleSheet } from 'react-native';
import Apple from '../assets/Icon Propio/Apple pixel art.svg';
import Google from '../assets/Icon Propio/Google pixelArt.svg';

const icones = {
  apple: Apple,
  google: Google,
};

export default function IconeProprio({ nome, tamanho = 24, cor = '#ffffff', style }) {
  const Icone = icones[nome];

  if (!Icone) {
    return null;
  }

  return <Icone width={tamanho} height={tamanho} color={cor} style={[styles.icone, style]} />;
}

const styles = StyleSheet.create({
  icone: {
    flexShrink: 0,
  },
});
