import { StyleSheet, View } from 'react-native';
import { cores } from '../styles/tema';

const DESENHO = [
  '....#####....',
  '..#########..',
  '.###.....###.',
  '.##.......##.',
  '##.........##',
  '##.........##',
  '##.........##',
  '##.........##',
  '.##.......##.',
  '.###.....###.',
  '..#########..',
  '....#####....',
];

const LINHAS = DESENHO.length;
const COLUNAS = DESENHO[0].length;

const fracaoDoBloco = (linha, coluna) => {
  const dx = coluna + 0.5 - COLUNAS / 2;
  const dy = linha + 0.5 - LINHAS / 2;
  const angulo = Math.atan2(-dx, dy);
  const anguloPositivo = angulo < 0 ? angulo + 2 * Math.PI : angulo;

  return anguloPositivo / (2 * Math.PI);
};

export default function AnelProgresso({ progresso, children }) {
  return (
    <View style={styles.anel}>
      {DESENHO.map((linha, indiceLinha) => (
        <View key={indiceLinha} style={styles.linha}>
          {[...linha].map((bloco, indiceColuna) => {
            const preenchido = bloco === '#';
            const feito = fracaoDoBloco(indiceLinha, indiceColuna) < progresso;
            const cor = feito ? cores.branco : cores.roxoEscuro;

            return (
              <View
                key={indiceColuna}
                style={[styles.bloco, preenchido && { backgroundColor: cor }]}
              />
            );
          })}
        </View>
      ))}
      <View style={styles.centro}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  anel: {
    width: 123,
    height: 121,
  },
  linha: {
    flex: 1,
    flexDirection: 'row',
  },
  bloco: {
    flex: 1,
  },
  centro: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
