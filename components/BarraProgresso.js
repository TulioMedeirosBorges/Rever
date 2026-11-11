import { StyleSheet, View } from 'react-native';
import { cores } from '../styles/tema';

export default function BarraProgresso({ feitos, total, cor = cores.sucesso }) {
  const blocos = Array.from({ length: total }, (_, indice) => indice < feitos);

  return (
    <View style={styles.barra}>
      {blocos.map((preenchido, indice) => (
        <View
          key={indice}
          style={[styles.bloco, { backgroundColor: preenchido ? cor : cores.trilha }]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  barra: {
    flexDirection: 'row',
    gap: 3,
  },
  bloco: {
    flex: 1,
    height: 8,
  },
});
