import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Tela from './Tela';
import Logo from './Logo';
import Botao from './Botao';
import { cores, fontes } from '../styles/tema';

export const ALTURA_ARTE = 390;

export default function TelaApresentacao({
  arte,
  titulo,
  texto,
  textoBotao,
  aoPressionar,
  rodape,
}) {
  const { height: alturaTela } = useWindowDimensions();
  const alturaArte = Math.min(ALTURA_ARTE, Math.round(alturaTela * 0.46));
  const escala = alturaArte / ALTURA_ARTE;

  return (
    <Tela bordas={['bottom']}>
      <View style={[styles.arte, { height: alturaArte }]}>{arte(escala)}</View>

      <View style={styles.conteudo}>
        <View style={styles.destaque}>
          {titulo ? (
            <Text style={styles.titulo} numberOfLines={2} adjustsFontSizeToFit>
              {titulo}
            </Text>
          ) : (
            <Logo />
          )}
        </View>

        <Text style={styles.texto} numberOfLines={2}>
          {texto}
        </Text>

        <View style={styles.botao}>
          <Botao texto={textoBotao} aoPressionar={aoPressionar} />
        </View>

        <View style={styles.rodape}>{rodape}</View>
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
