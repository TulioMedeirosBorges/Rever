import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import IconeProprio from './IconeProprio';
import MolduraPixel from './MolduraPixel';
import { cores, fontes } from '../styles/tema';
import { toqueMedio } from '../utils/tato';

const variantes = {
  principal: { fundo: cores.roxo, texto: cores.fundo },
  claro: { fundo: cores.branco, topo: cores.cinzaClaro, texto: cores.preto },
  perigo: { fundo: cores.arcoIris[0], texto: cores.branco },
};

export default function Botao({ texto, aoPressionar, variante = 'principal', icone }) {
  const { fundo, topo, texto: corTexto } = variantes[variante];
  const claro = variante === 'claro';

  return (
    <TouchableOpacity
      style={styles.toque}
      onPress={() => {
        toqueMedio();
        aoPressionar?.();
      }}
      activeOpacity={0.7}
    >
      <MolduraPixel corFundo={fundo} corTopo={topo}>
        <View style={[styles.conteudo, claro && styles.conteudoClaro]}>
          {icone ? <IconeProprio nome={icone} cor={cores.preto} style={styles.icone} /> : null}
          <Text
            style={[styles.texto, claro && styles.textoClaro, { color: corTexto }]}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {texto}
          </Text>
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
    minHeight: 58,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  conteudoClaro: {
    minHeight: 50,
  },
  icone: {
    marginRight: 12,
  },
  texto: {
    flexShrink: 1,
    fontSize: 24,
    fontFamily: fontes.negrito,
    fontVariant: fontes.semLigaduras,
  },
  textoClaro: {
    fontSize: 20,
    fontFamily: fontes.regular,
    fontVariant: fontes.semLigaduras,
  },
});
