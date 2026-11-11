import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import IconeProprio from './IconeProprio';
import { cores } from '../styles/tema';

export default function Botao({ texto, aoPressionar, variante = 'escuro', icone }) {
  const claro = variante === 'claro';

  return (
    <TouchableOpacity
      style={[styles.botao, claro && styles.botaoClaro]}
      onPress={aoPressionar}
    >
      {icone ? (
        <IconeProprio nome={icone} cor={cores.preto} style={styles.icone} />
      ) : null}
      <Text style={[styles.texto, claro && styles.textoClaro]}>{texto}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  botao: {
    flexDirection: 'row',
    backgroundColor: cores.botao,
    minHeight: 56,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginVertical: 8,
  },
  botaoClaro: {
    backgroundColor: cores.branco,
    minHeight: 48,
  },
  icone: {
    marginRight: 12,
  },
  texto: {
    color: cores.branco,
    fontSize: 18,
    fontWeight: 'bold',
  },
  textoClaro: {
    color: cores.preto,
    fontSize: 16,
    fontWeight: 'normal',
  },
});
