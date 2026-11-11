import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import IconeProprio from './IconeProprio';
import MolduraPixel from './MolduraPixel';
import { cores } from '../styles/tema';

export default function Botao({ texto, aoPressionar, variante = 'escuro', icone }) {
  const claro = variante === 'claro';

  return (
    <TouchableOpacity style={styles.toque} onPress={aoPressionar}>
      <MolduraPixel
        corFundo={claro ? cores.branco : cores.botao}
        corTopo={claro ? cores.cinzaClaro : undefined}
      >
        <View style={[styles.conteudo, claro && styles.conteudoClaro]}>
          {icone ? <IconeProprio nome={icone} cor={cores.preto} style={styles.icone} /> : null}
          <Text style={[styles.texto, claro && styles.textoClaro]}>{texto}</Text>
        </View>
      </MolduraPixel>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  toque: {
    marginVertical: 8,
  },
  conteudo: {
    flexDirection: 'row',
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  conteudoClaro: {
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
