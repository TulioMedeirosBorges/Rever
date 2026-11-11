import { StyleSheet, Text, View } from 'react-native';
import MolduraPixel from './MolduraPixel';
import IconePixel from './IconePixel';
import { cores, fontes } from '../styles/tema';

export default function CartaoEstatistica({ icone, valor, rotulo, cor }) {
  return (
    <MolduraPixel corFundo={cores.cartao} pixel={3} style={styles.moldura}>
      <View style={styles.conteudo}>
        <IconePixel nome={icone} tamanho={22} cor={cor} />
        <Text style={[styles.valor, { color: cor }]}>{valor}</Text>
        <Text style={styles.rotulo}>{rotulo}</Text>
      </View>
    </MolduraPixel>
  );
}

const styles = StyleSheet.create({
  moldura: {
    flex: 1,
  },
  conteudo: {
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 6,
  },
  valor: {
    fontFamily: fontes.negrito,
    fontVariant: fontes.semLigaduras,
    fontSize: 26,
    marginTop: 6,
  },
  rotulo: {
    color: cores.branco,
    fontFamily: fontes.regular,
    fontVariant: fontes.semLigaduras,
    fontSize: 13,
    textAlign: 'center',
    marginTop: 2,
  },
});
