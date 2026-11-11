import { StyleSheet, View } from 'react-native';
import Tela from '../components/Tela';
import PixelsDecorativos from '../components/PixelsDecorativos';
import CabecalhoTela from '../components/CabecalhoTela';
import FormularioHabito from '../components/FormularioHabito';
import FaixaArcoIris from '../components/FaixaArcoIris';
import CantosPixel from '../components/CantosPixel';
import { useHabitos } from '../contexto/HabitosContexto';

export default function CriarHabito({ navigation }) {
  const { adicionarHabito } = useHabitos();

  const salvar = (dados) => {
    adicionarHabito(dados);
    navigation.goBack();
  };

  return (
    <Tela bordas={['top']}>
      <PixelsDecorativos />
      <View style={styles.cabecalho}>
        <CabecalhoTela titulo="Criar Hábito" mostrarVoltar aoVoltar={() => navigation.goBack()} />
      </View>
      <FormularioHabito textoBotao="Salvar hábito" aoSalvar={salvar} />
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
