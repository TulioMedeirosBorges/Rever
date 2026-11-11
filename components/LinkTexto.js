import { StyleSheet, Text } from 'react-native';
import { cores, fontes } from '../styles/tema';
import Pressionavel from './Pressionavel';

export default function LinkTexto({ texto, aoPressionar, tamanho = 16 }) {
  return (
    <Pressionavel style={styles.area} aoPressionar={aoPressionar} escala={0.9}>
      <Text style={[styles.texto, { fontSize: tamanho }]}>{texto}</Text>
    </Pressionavel>
  );
}

const styles = StyleSheet.create({
  area: {
    alignSelf: 'center',
    padding: 8,
  },
  texto: {
    color: cores.link,
    fontFamily: fontes.negrito,
    fontVariant: fontes.semLigaduras,
  },
});
