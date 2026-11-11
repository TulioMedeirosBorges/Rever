import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MolduraPixel from './MolduraPixel';
import IconePixel from './IconePixel';
import { cores, fontes } from '../styles/tema';

export default function ItemMenu({ icone, texto, detalhe, aoPressionar }) {
  return (
    <TouchableOpacity style={styles.toque} onPress={aoPressionar} activeOpacity={0.7}>
      <MolduraPixel corFundo={cores.cartao} pixel={3}>
        <View style={styles.item}>
          <IconePixel nome={icone} tamanho={22} cor={cores.roxo} />
          <Text style={styles.texto}>{texto}</Text>
          {detalhe ? <Text style={styles.detalhe}>{detalhe}</Text> : null}
          <IconePixel nome="chevron-right" tamanho={22} cor={cores.branco} />
        </View>
      </MolduraPixel>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  toque: {
    marginBottom: 10,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    paddingHorizontal: 14,
  },
  texto: {
    flex: 1,
    color: cores.branco,
    fontFamily: fontes.regular,
    fontVariant: fontes.semLigaduras,
    fontSize: 19,
    marginLeft: 12,
  },
  detalhe: {
    color: cores.cinza,
    fontFamily: fontes.regular,
    fontVariant: fontes.semLigaduras,
    fontSize: 15,
    marginRight: 6,
  },
});
