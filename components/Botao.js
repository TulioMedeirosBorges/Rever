import { StyleSheet, Text, View } from 'react-native';
import IconeProprio from './IconeProprio';
import MolduraPixel from './MolduraPixel';
import { cores, fontes } from '../styles/tema';
import Pressionavel from './Pressionavel';

const ALTURA_BASE = 4;

const variantes = {
  principal: { fundo: cores.principal, base: '#a8916a', texto: cores.preto },
  claro: { fundo: cores.cartaoDestaque, base: cores.sombra, texto: cores.branco },
  perigo: { fundo: cores.perigo, base: '#8a241d', texto: cores.branco },
};

export default function Botao({ texto, aoPressionar, variante = 'principal', icone }) {
  const { fundo, base, texto: corTexto } = variantes[variante];
  const claro = variante === 'claro';

  return (
    <View style={styles.toque}>
      <MolduraPixel corFundo={base} style={styles.base} />
      <Pressionavel
        aoPressionar={aoPressionar}
        vibracaoApertar="apertar"
        escala={1}
        afundar={ALTURA_BASE}
        accessibilityRole="button"
      >
        <MolduraPixel corFundo={fundo}>
          <View style={[styles.conteudo, claro && styles.conteudoClaro]}>
            {icone ? <IconeProprio nome={icone} cor={corTexto} style={styles.icone} /> : null}
            <Text
              style={[styles.texto, claro && styles.textoClaro, { color: corTexto }]}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {texto}
            </Text>
          </View>
        </MolduraPixel>
      </Pressionavel>
    </View>
  );
}

const styles = StyleSheet.create({
  toque: {
    marginVertical: 8,
    paddingBottom: ALTURA_BASE,
  },
  base: {
    position: 'absolute',
    top: ALTURA_BASE,
    bottom: 0,
    left: 0,
    right: 0,
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
