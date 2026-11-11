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

export default function AnelProgresso({
  progresso,
  cor = cores.principal,
  bloco = BLOCO,
  texto,
  tamanhoTexto = 24,
}) {
  const escala = bloco / BLOCO;
  const lado = TAMANHO * bloco;

  return (
    <View style={[styles.anel, { width: lado, height: lado }]}>
      {blocos.map(({ chave, left, top, fracao }) => (
        <View
          key={chave}
          style={[
            styles.bloco,
            {
              left: left * escala,
              top: top * escala,
              width: bloco,
              height: bloco,
              backgroundColor: fracao < progresso ? cor : cores.trilha,
            },
          ]}
        />
      ))}
      <Text
        style={[
          styles.porcentagem,
          {
            color: cor,
            fontSize: tamanhoTexto,
            maxWidth: (texto ? LARGURA_BURACO + 1.6 * BLOCO : LARGURA_BURACO) * escala,
          },
        ]}
        numberOfLines={1}
        adjustsFontSizeToFit
        allowFontScaling={false}
      >
        {texto ?? `${Math.round(progresso * 100)}%`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  anel: {
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bloco: {
    position: 'absolute',
  },
  porcentagem: {
    fontFamily: fontes.negrito,
    fontVariant: fontes.semLigaduras,
    textAlign: 'center',
  },
});
