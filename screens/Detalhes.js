import { StyleSheet, View } from 'react-native';
import Cabecalho from '../components/Cabecalho';

export default function Detalhes({ route }) {
  const { titulo } = route.params;

  return (
    <View style={styles.container}>
      <Cabecalho titulo={titulo} subtitulo="Tela de detalhes" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f2f4f8',
  },
});
