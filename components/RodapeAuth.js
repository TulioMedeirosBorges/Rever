import { StyleSheet, Text, View } from 'react-native';
import LinkTexto from './LinkTexto';
import { cores, fontes } from '../styles/tema';

export default function RodapeAuth({ texto, textoLink, aoPressionar }) {
  return (
    <View style={styles.rodape}>
      <Text style={styles.texto}>{texto}</Text>
      <LinkTexto texto={textoLink} aoPressionar={aoPressionar} />
    </View>
  );
}

const styles = StyleSheet.create({
  rodape: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  texto: {
    color: cores.branco,
    fontFamily: fontes.negrito,
    fontVariant: fontes.semLigaduras,
    fontSize: 16,
  },
});
