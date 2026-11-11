import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import Tela from '../components/Tela';
import CabecalhoTela from '../components/CabecalhoTela';
import BarraInferior from '../components/BarraInferior';
import MolduraPixel from '../components/MolduraPixel';
import { cores } from '../styles/tema';

const periodos = ['sem', 'mes', 'ano'];

const barras = [
  { dia: 'SEG', altura: 100 },
  { dia: 'TER', altura: 60 },
  { dia: 'QUA', altura: 100 },
  { dia: 'QUI', altura: 60 },
  { dia: 'SEX', altura: 100 },
  { dia: 'SAB', altura: 75 },
  { dia: 'DOM', altura: 50 },
];

export default function Progresso() {
  const periodoSelecionado = 'sem';

  return (
    <Tela>
      <ScrollView contentContainerStyle={styles.conteudo}>
        <CabecalhoTela titulo="Seu progresso" />

        <MolduraPixel corFundo={cores.cartao} pixel={3} style={styles.molduraPeriodos}>
          <View style={styles.periodos}>
            {periodos.map((periodo) => (
              <MolduraPixel
                key={periodo}
                corFundo={periodo === periodoSelecionado ? cores.cartaoDestaque : 'transparent'}
                pixel={3}
                style={styles.periodo}
              >
                <Text style={styles.textoPeriodo}>{periodo}</Text>
              </MolduraPixel>
            ))}
          </View>
        </MolduraPixel>

        <View style={styles.grafico}>
          {barras.map(({ dia, altura }) => (
            <View key={dia} style={styles.colunaGrafico}>
              <View style={styles.topoBarra} />
              <View style={[styles.barra, { height: altura }]} />
              <Text style={styles.diaGrafico}>{dia}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.secao}>Sequencia atual</Text>
        <View style={styles.sequencia}>
          <Image source={require('../assets/icones/fogo.png')} style={styles.fogo} />
          <Text style={styles.numero}>5</Text>
          <Text style={styles.dias}>dias</Text>
        </View>
      </ScrollView>
      <BarraInferior abaAtiva="Progresso" />
    </Tela>
  );
}

const styles = StyleSheet.create({
  conteudo: {
    padding: 20,
    paddingTop: 48,
  },
  molduraPeriodos: {
    marginHorizontal: 12,
    marginBottom: 40,
  },
  periodos: {
    flexDirection: 'row',
    padding: 4,
  },
  periodo: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  textoPeriodo: {
    color: cores.branco,
    fontSize: 22,
  },
  grafico: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 140,
    marginBottom: 40,
  },
  colunaGrafico: {
    alignItems: 'center',
  },
  topoBarra: {
    width: 18,
    height: 6,
    backgroundColor: cores.roxo,
  },
  barra: {
    width: 24,
    backgroundColor: cores.roxo,
  },
  diaGrafico: {
    color: cores.branco,
    fontSize: 13,
    marginTop: 6,
  },
  secao: {
    color: cores.branco,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  sequencia: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fogo: {
    width: 72,
    height: 72,
    tintColor: cores.arcoIris[1],
  },
  numero: {
    color: cores.branco,
    fontSize: 36,
    fontWeight: 'bold',
    marginLeft: 24,
  },
  dias: {
    color: cores.branco,
    fontSize: 26,
    fontWeight: 'bold',
    marginLeft: 12,
  },
});
