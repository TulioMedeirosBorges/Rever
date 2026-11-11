import { StyleSheet, View } from 'react-native';
import Tela from '../components/Tela';
import CabecalhoTela from '../components/CabecalhoTela';
import FormularioHabito from '../components/FormularioHabito';
import FaixaArcoIris from '../components/FaixaArcoIris';
import CantosPixel from '../components/CantosPixel';
import { habitos } from '../data/habitos';

export default function EditarHabito({ navigation, route }) {
  const { id } = route.params;
  const habito = habitos.find((item) => item.id === id);

  return (
    <Tela>
      <View style={styles.cabecalho}>
        <CabecalhoTela titulo="Editar Hábito" mostrarVoltar aoVoltar={() => navigation.goBack()} />
      </View>
      <FormularioHabito nome={habito.nome} categoria="Saúde" frequencia={[0, 2]} lembrete="19:00" />
      <View>
        <FaixaArcoIris altura={70} />
        <CantosPixel />
      </View>
    </Tela>
  );
}

const styles = StyleSheet.create({
  cabecalho: {
    paddingHorizontal: 20,
    paddingTop: 32,
  },
});
