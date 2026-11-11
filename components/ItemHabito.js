import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MolduraPixel from './MolduraPixel';
import IconePixel from './IconePixel';
import { cores, fontes } from '../styles/tema';
import { sucesso, toqueLeve } from '../utils/tato';

export default function ItemHabito({
  nome,
  icone,
  detalhe,
  concluido,
  mostrarSeta,
  aoPressionar,
  aoMarcar,
}) {
  return (
    <TouchableOpacity
      style={styles.toque}
      onPress={() => {
        toqueLeve();
        aoPressionar?.();
      }}
      activeOpacity={0.7}
    >
      <MolduraPixel corFundo={concluido ? cores.cartaoDestaque : cores.cartao} pixel={3}>
        <View style={styles.item}>
          <TouchableOpacity
            onPress={() => {
              if (concluido) {
                toqueLeve();
              } else {
                sucesso();
              }
              aoMarcar();
            }}
            disabled={!aoMarcar}
            activeOpacity={0.6}
            hitSlop={10}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: Boolean(concluido) }}
            accessibilityLabel={`Marcar ${nome} como feito`}
          >
            <MolduraPixel
              corFundo={concluido ? cores.roxo : cores.caixa}
              pixel={3}
              degraus={1}
              style={styles.caixa}
            >
              {concluido ? <IconePixel nome="check" tamanho={22} cor={cores.fundo} /> : null}
            </MolduraPixel>
          </TouchableOpacity>
          <IconePixel nome={icone} tamanho={24} cor={cores.branco} style={styles.icone} />
          <View style={styles.textos}>
            <Text style={styles.nome} numberOfLines={1}>
              {nome}
            </Text>
            {detalhe ? (
              <Text style={styles.detalhe} numberOfLines={1}>
                {detalhe}
              </Text>
            ) : null}
          </View>
          {mostrarSeta ? (
            <IconePixel
              nome="chevron-right-2"
              tamanho={34}
              cor={cores.cinzaClaro}
              style={styles.seta}
            />
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
    minHeight: 50,
    paddingVertical: 6,
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
  textos: {
    flex: 1,
    marginLeft: 12,
  },
  nome: {
    color: cores.branco,
    fontFamily: fontes.regular,
    fontVariant: fontes.semLigaduras,
    fontSize: 21,
    letterSpacing: 1,
  },
  detalhe: {
    color: cores.cinzaClaro,
    fontFamily: fontes.regular,
    fontVariant: fontes.semLigaduras,
    fontSize: 13,
    letterSpacing: 0.5,
    marginTop: -2,
  },
});
