import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MolduraPixel from './MolduraPixel';
import IconePixel from './IconePixel';
import { cores, fontes } from '../styles/tema';

export default function ItemHabito({ nome, icone, concluido, mostrarSeta, aoPressionar }) {
  return (
    <TouchableOpacity style={styles.toque} onPress={aoPressionar} activeOpacity={0.7}>
      <MolduraPixel corFundo={concluido ? cores.cartaoDestaque : cores.cartao} pixel={3}>
        <View style={styles.item}>
          <MolduraPixel
            corFundo={concluido ? cores.roxoEscuro : cores.branco}
            pixel={3}
            degraus={1}
            style={styles.caixa}
          >
            {concluido ? <IconePixel nome="check" tamanho={22} cor={cores.branco} /> : null}
          </MolduraPixel>
          <IconePixel nome={icone} tamanho={24} cor={cores.branco} style={styles.icone} />
          <Text style={styles.nome} numberOfLines={1}>
            {nome}
          </Text>
          {mostrarSeta ? (
            <IconePixel nome="chevron-right-2" tamanho={34} cor={cores.branco} style={styles.seta} />
          ) : null}
        </View>
      </MolduraPixel>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  toque: {
    marginBottom: 12,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    height: 50,
  },
  caixa: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icone: {
    marginLeft: 14,
  },
  seta: {
    marginRight: -4,
  },
  nome: {
    flex: 1,
    color: cores.branco,
    fontFamily: fontes.regular,
    fontVariant: fontes.semLigaduras,
    fontSize: 21,
    letterSpacing: 1,
    marginLeft: 12,
  },
});
