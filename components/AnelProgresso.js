import { StyleSheet, Text, View } from 'react-native';
import { cores, fontes } from '../styles/tema';

const BLOCO = 10;

const DESENHO = [
  '....####....',
  '..########..',
  '.###....###.',
  '.##......##.',
  '##........##',
  '##........##',
  '##........##',
  '##........##',
  '.##......##.',
  '.###....###.',
  '..########..',
  '....####....',
];

const TAMANHO = DESENHO.length;
const LARGURA_BURACO = 6 * BLOCO;

const fracaoDoBloco = (linha, coluna) => {
  const dx = coluna + 0.5 - TAMANHO / 2;
  const dy = linha + 0.5 - TAMANHO / 2;
  const angulo = Math.atan2(-dx, dy);
  const anguloPositivo = angulo < 0 ? angulo + 2 * Math.PI : angulo;

  return anguloPositivo / (2 * Math.PI);
};

const blocos = DESENHO.flatMap((linha, indiceLinha) =>
  [...linha]
    .map((bloco, indiceColuna) => ({
      chave: `${indiceLinha}-${indiceColuna}`,
      preenchido: bloco === '#',
      left: indiceColuna * BLOCO,
      top: indiceLinha * BLOCO,
      fracao: fracaoDoBloco(indiceLinha, indiceColuna),
    }))
    .filter(({ preenchido }) => preenchido),
);

export default function AnelProgresso({ progresso, cor = cores.principal }) {
  return (
    <View style={styles.anel}>
      {blocos.map(({ chave, left, top, fracao }) => (
        <View
          key={chave}
          style={[
            styles.bloco,
            { left, top, backgroundColor: fracao < progresso ? cor : cores.trilha },
          ]}
        />
      ))}
      <Text
        style={[styles.porcentagem, { color: cor }]}
        numberOfLines={1}
        adjustsFontSizeToFit
        allowFontScaling={false}
      >
        {`${Math.round(progresso * 100)}%`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  anel: {
    width: TAMANHO * BLOCO,
    height: TAMANHO * BLOCO,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bloco: {
    position: 'absolute',
    width: BLOCO,
    height: BLOCO,
  },
  porcentagem: {
    maxWidth: LARGURA_BURACO,
    color: cores.branco,
    fontFamily: fontes.negrito,
    fontVariant: fontes.semLigaduras,
    fontSize: 24,
    textAlign: 'center',
  },
});
