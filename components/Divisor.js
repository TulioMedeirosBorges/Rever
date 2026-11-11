import { StyleSheet, Text, View } from 'react-native';
import { cores, fontes } from '../styles/tema';

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
    color: cores.link,
    marginHorizontal: 10,
    fontFamily: fontes.regular,
    fontVariant: fontes.semLigaduras,
    fontSize: 15,
  },
});
