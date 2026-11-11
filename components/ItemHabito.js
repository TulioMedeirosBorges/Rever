import { StyleSheet, Text, View } from 'react-native';
import MolduraPixel from './MolduraPixel';
import IconePixel from './IconePixel';
import { cores, fontes } from '../styles/tema';
import Pressionavel from './Pressionavel';

export default function ItemHabito({
  nome,
  icone,
  detalhe,
  concluido,
  mostrarSeta,
  aoPressionar,
  aoMarcar,
  cor,
  etiqueta,
}) {
  return (
    <Pressionavel style={styles.toque} aoPressionar={aoPressionar} escala={0.97}>
      <MolduraPixel
        corFundo={concluido ? cores.cartaoDestaque : cores.cartao}
        corTopo={cor}
        pixel={3}
      >
        <View style={styles.item}>
          <Pressionavel
            aoPressionar={aoMarcar}
            disabled={!aoMarcar}
            escala={0.75}
            vibracaoSoltar={concluido ? 'soltar' : 'sucesso'}
            som={concluido ? 'desmarcar' : 'marcar'}
            hitSlop={10}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: Boolean(concluido) }}
            accessibilityLabel={`Marcar ${nome} como feito`}
          >
            <MolduraPixel
              corFundo={concluido ? cores.sucesso : cores.trilha}
              pixel={3}
              degraus={1}
              style={styles.caixa}
            >
              {concluido ? <IconePixel nome="check" tamanho={22} cor={cores.fundo} /> : null}
            </MolduraPixel>
          </Pressionavel>
          <IconePixel nome={icone} tamanho={24} cor={cor ?? cores.branco} style={styles.icone} />
          <View style={styles.textos}>
            <View style={styles.linhaNome}>
              {etiqueta ? (
                <Text style={[styles.etiqueta, { backgroundColor: cor ?? cores.trilha }]}>
                  {etiqueta}
                </Text>
              ) : null}
              <Text style={styles.nome} numberOfLines={1}>
                {nome}
              </Text>
            </View>
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
    </Pressionavel>
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
  linhaNome: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  etiqueta: {
    color: cores.preto,
    fontFamily: fontes.negrito,
    fontVariant: fontes.semLigaduras,
    fontSize: 9,
    letterSpacing: 0.5,
    paddingHorizontal: 4,
    paddingTop: 2,
    paddingBottom: 1,
    marginRight: 6,
  },
  nome: {
    flexShrink: 1,
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
