import { StyleSheet, View } from 'react-native';
import { cores } from '../styles/tema';

export default function CantosPixel({ cor = cores.fundo }) {
  const fundo = { backgroundColor: cor };

  return (
    <>
      <View style={[styles.degrauAlto, styles.esquerda, fundo]} />
      <View style={[styles.degrauBaixo, styles.esquerda, fundo]} />
      <View style={[styles.degrauAlto, styles.direita, fundo]} />
      <View style={[styles.degrauBaixo, styles.direita, fundo]} />
    </>
  );
}

const styles = StyleSheet.create({
  degrauAlto: {
    position: 'absolute',
    top: 0,
    width: 18,
    height: 8,
  },
  degrauBaixo: {
    position: 'absolute',
    top: 8,
    width: 9,
    height: 13,
  },
  esquerda: {
    left: 0,
  },
  direita: {
    right: 0,
  },
});
