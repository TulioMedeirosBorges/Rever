import { StyleSheet, View } from 'react-native';
import Cabecalho from '../components/Cabecalho';
import Card from '../components/Card';
import Botao from '../components/Botao';

export default function Home({ navigation }) {
  return (
    <View style={styles.container}>
      <Cabecalho titulo="Início" subtitulo="Estrutura base do app" />
      <Card
        titulo="Item de exemplo"
        subtitulo="Toque para ver os detalhes"
        aoPressionar={() => navigation.navigate('Detalhes', { titulo: 'Item de exemplo' })}
      />
      <Botao texto="Abrir formulário" aoPressionar={() => navigation.navigate('Formulario')} />
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
