import { StyleSheet, Text, View } from 'react-native';
import { cores } from '../styles/tema';

export default function Divisor({ texto }) {
  return (
    <View style={styles.container}>
      <View style={styles.linha} />
      <Text style={styles.texto}>{texto}</Text>
      <View style={styles.linha} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
  linha: {
    flex: 1,
    height: 1,
    backgroundColor: cores.branco,
  },
  texto: {
    color: cores.amarelo,
    marginHorizontal: 10,
    fontSize: 13,
  },
});
