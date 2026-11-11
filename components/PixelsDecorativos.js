import { StyleSheet, View } from 'react-native';
import { cores } from '../styles/tema';

const pixels = [
  { x: 94, y: 16, cor: cores.trilha },
  { x: 272, y: 32, cor: cores.trilha },
  { x: 70, y: 37, cor: cores.cartao },
  { x: 120, y: 40, cor: cores.cartao },
  { x: 130, y: 40, cor: cores.trilha },
  { x: 262, y: 42, cor: cores.cartao },
];

export default function PixelsDecorativos() {
  return (
    <View style={styles.camada} pointerEvents="none">
      {pixels.map(({ x, y, cor }) => (
        <View
          key={`${x}-${y}`}
          style={[styles.pixel, { left: x, top: y - 12, backgroundColor: cor }]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  camada: {
    ...StyleSheet.absoluteFillObject,
  },
  pixel: {
    position: 'absolute',
    width: 10,
    height: 10,
  },
});
