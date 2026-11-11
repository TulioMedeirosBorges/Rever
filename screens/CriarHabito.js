import { StyleSheet, View } from 'react-native';
import Tela from '../components/Tela';
import CabecalhoTela from '../components/CabecalhoTela';
import FormularioHabito from '../components/FormularioHabito';
import FaixaArcoIris from '../components/FaixaArcoIris';

export default function CriarHabito() {
  return (
    <Tela>
      <View style={styles.cabecalho}>
        <CabecalhoTela titulo="Criar Hábito" mostrarVoltar />
      </View>
      <FormularioHabito nome="" categoria="Saúde" frequencia={[0, 2]} lembrete="19:00" />
      <FaixaArcoIris altura={70} />
    </Tela>
  );
}

const styles = StyleSheet.create({
  cabecalho: {
    paddingHorizontal: 20,
    paddingTop: 32,
  },
});
