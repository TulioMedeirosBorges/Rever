import { StyleSheet, View } from 'react-native';
import { cores } from '../styles/tema';

export default function FaixaArcoIris({ altura = 4 }) {
  return (
    <View style={styles.faixa}>
      {cores.arcoIris.map((cor) => (
        <View key={cor} style={[styles.parte, { backgroundColor: cor, height: altura }]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  faixa: {
    flexDirection: 'row',
    width: '100%',
  },
  parte: {
    flex: 1,
  },
});
