import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { cores, fontes } from '../styles/tema';
import { toqueLeve } from '../utils/tato';

export default function LinkTexto({ texto, aoPressionar, tamanho = 16 }) {
  return (
    <TouchableOpacity
      style={styles.area}
      onPress={() => {
        toqueLeve();
        aoPressionar?.();
      }}
      activeOpacity={0.6}
    >
      <Text style={[styles.texto, { fontSize: tamanho }]}>{texto}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  area: {
    alignSelf: 'center',
    padding: 8,
  },
  texto: {
    color: cores.amarelo,
    fontFamily: fontes.negrito,
    fontVariant: fontes.semLigaduras,
  },
});
