import { StyleSheet, View } from 'react-native';
import Tela from '../components/Tela';
import PixelsDecorativos from '../components/PixelsDecorativos';
import CabecalhoTela from '../components/CabecalhoTela';
import FormularioHabito from '../components/FormularioHabito';
import Botao from '../components/Botao';
import FaixaArcoIris from '../components/FaixaArcoIris';
import CantosPixel from '../components/CantosPixel';
import { habitos } from '../data/habitos';

export default function EditarHabito({ navigation, route }) {
  const { id } = route.params;
  const { icone, nome, categoria, frequencia, lembrete } = habitos.find((item) => item.id === id);

  return (
    <Tela bordas={['top']}>
      <PixelsDecorativos />
      <View style={styles.cabecalho}>
        <CabecalhoTela titulo="Editar Hábito" mostrarVoltar aoVoltar={() => navigation.goBack()} />
      </View>
      <FormularioHabito
        icone={icone}
        nome={nome}
        categoria={categoria}
        frequencia={frequencia}
        lembrete={lembrete}
      >
        <Botao texto="Salvar alterações" aoPressionar={() => navigation.goBack()} />
        <Botao texto="Excluir hábito" variante="perigo" aoPressionar={() => navigation.goBack()} />
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
