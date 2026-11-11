import { StyleSheet, Text, View } from 'react-native';
import IconePixel from './IconePixel';
import FaixaArcoIris from './FaixaArcoIris';
import { cores, fontes } from '../styles/tema';
import Pressionavel from './Pressionavel';

export default function CabecalhoTela({ titulo, mostrarVoltar, aoVoltar }) {
  return (
    <View style={styles.container}>
      <View style={styles.linha}>
        {mostrarVoltar ? (
          <Pressionavel
            aoPressionar={aoVoltar}
            style={styles.voltar}
            escala={0.85}
            accessibilityLabel="Voltar"
          >
            <IconePixel nome="chevron-left-2" tamanho={46} cor={cores.branco} />
          </Pressionavel>
        ) : null}
        <Text style={[styles.titulo, mostrarVoltar && styles.tituloCentro]}>{titulo}</Text>
      </View>
      <FaixaArcoIris />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  voltar: {
    position: 'absolute',
    left: -22,
    padding: 4,
    zIndex: 1,
  },
  titulo: {
    color: cores.branco,
    fontSize: 32,
    fontFamily: fontes.negrito,
    fontVariant: fontes.semLigaduras,
  },
  tituloCentro: {
    flex: 1,
    textAlign: 'center',
  },
});
