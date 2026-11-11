import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Tela from './Tela';
import Logo from './Logo';
import Botao from './Botao';
import Entrada from './Entrada';
import { cores, fontes } from '../styles/tema';

export const ALTURA_ARTE = 390;

export default function TelaApresentacao({
  arte,
  titulo,
  texto,
  textoBotao,
  aoPressionar,
  rodape,
  atrasoConteudo = 0,
  logo,
}) {
  const { height: alturaTela } = useWindowDimensions();
  const alturaArte = Math.min(ALTURA_ARTE, Math.round(alturaTela * 0.46));
  const escala = alturaArte / ALTURA_ARTE;

  return (
    <Tela bordas={['bottom']}>
      <View style={[styles.arte, { height: alturaArte }]}>{arte(escala)}</View>

      <View style={styles.conteudo}>
        {logo ? (
          <View style={styles.destaque}>{logo}</View>
        ) : (
          <Entrada
            tipo={titulo ? 'direita' : 'escala'}
            mola={titulo ? 'viva' : 'quique'}
            atraso={atrasoConteudo}
            style={styles.destaque}
          >
            {titulo ? (
              <Text style={styles.titulo} numberOfLines={2} adjustsFontSizeToFit>
                {titulo}
              </Text>
            ) : (
              <Logo />
            )}
          </Entrada>
        )}

        <Entrada ordem={1} atraso={atrasoConteudo}>
          <Text style={styles.texto} numberOfLines={2}>
            {texto}
          </Text>
        </Entrada>

        <Entrada ordem={2} atraso={atrasoConteudo} style={styles.botao}>
          <Botao texto={textoBotao} aoPressionar={aoPressionar} />
        </Entrada>

        <Entrada ordem={3} atraso={atrasoConteudo} style={styles.rodape}>
          {rodape}
        </Entrada>
      </View>
    </Tela>
  );
}

const styles = StyleSheet.create({
  arte: {
    alignItems: 'center',
    overflow: 'hidden',
  },
  conteudo: {
    paddingHorizontal: 28,
    paddingTop: 28,
  },
  destaque: {
    height: 88,
    justifyContent: 'center',
  },
  titulo: {
    color: cores.branco,
    fontFamily: fontes.negrito,
    fontVariant: fontes.semLigaduras,
    fontSize: 38,
    lineHeight: 44,
    textAlign: 'center',
  },
  texto: {
    height: 58,
    marginTop: 16,
    color: cores.branco,
    fontFamily: fontes.regular,
    fontVariant: fontes.semLigaduras,
    fontSize: 23,
    lineHeight: 29,
    textAlign: 'center',
  },
  botao: {
    marginTop: 20,
    paddingHorizontal: 48,
  },
  rodape: {
    height: 44,
    marginTop: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
