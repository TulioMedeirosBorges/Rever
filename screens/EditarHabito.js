import { Alert, StyleSheet, View } from 'react-native';
import Tela from '../components/Tela';
import PixelsDecorativos from '../components/PixelsDecorativos';
import CabecalhoTela from '../components/CabecalhoTela';
import FormularioHabito from '../components/FormularioHabito';
import Botao from '../components/Botao';
import FaixaArcoIris from '../components/FaixaArcoIris';
import CantosPixel from '../components/CantosPixel';
import { useHabitos } from '../contexto/HabitosContexto';

export default function EditarHabito({ navigation, route }) {
  const { id } = route.params;
  const { habitos, editarHabito, excluirHabito } = useHabitos();
  const habito = habitos.find((item) => item.id === id);

  if (!habito) {
    return null;
  }

  const salvar = (dados) => {
    editarHabito(id, dados);
    navigation.goBack();
  };

  const excluir = () => {
    Alert.alert('Excluir hábito', `Deseja excluir "${habito.nome}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () => {
          navigation.goBack();
          excluirHabito(id);
        },
      },
    ]);
  };

  return (
    <Tela bordas={['top']}>
      <PixelsDecorativos />
      <View style={styles.cabecalho}>
        <CabecalhoTela titulo="Editar Hábito" mostrarVoltar aoVoltar={() => navigation.goBack()} />
      </View>
      <FormularioHabito valoresIniciais={habito} textoBotao="Salvar alterações" aoSalvar={salvar}>
        <Botao texto="Excluir hábito" variante="perigo" aoPressionar={excluir} />
      </FormularioHabito>
      <View>
        <FaixaArcoIris altura={56} />
        <CantosPixel />
      </View>
    </Tela>
  );
}

const styles = StyleSheet.create({
  cabecalho: {
    paddingHorizontal: 20,
    paddingTop: 48,
  },
});
