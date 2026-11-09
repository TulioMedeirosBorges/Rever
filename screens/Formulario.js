import { StyleSheet, View } from 'react-native';
import Cabecalho from '../components/Cabecalho';

export default function Formulario() {
  return (
    <View style={styles.container}>
      <Cabecalho titulo="Formulário" subtitulo="Tela de cadastro" />
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
