import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Tela from '../components/Tela';
import PixelsDecorativos from '../components/PixelsDecorativos';
import CabecalhoTela from '../components/CabecalhoTela';
import ItemHabito from '../components/ItemHabito';
import MolduraPixel from '../components/MolduraPixel';
import BarraInferior from '../components/BarraInferior';
import { useHabitos } from '../contexto/HabitosContexto';
import { cores, fontes } from '../styles/tema';

const semana = [
  { sigla: 'SEG', dia: 13 },
  { sigla: 'TER', dia: 14 },
  { sigla: 'QUA', dia: 15 },
  { sigla: 'QUI', dia: 16 },
  { sigla: 'SEX', dia: 17 },
  { sigla: 'SAB', dia: 18 },
  { sigla: 'DOM', dia: 19 },
];

export default function Agenda() {
  const { habitos, alternarConcluido } = useHabitos();
  const diaSelecionado = 13;
  const indiceDia = semana.findIndex(({ dia }) => dia === diaSelecionado);
  const habitosDoDia = habitos.filter(({ frequencia }) => frequencia.includes(indiceDia));
  const concluidos = habitosDoDia.filter(({ concluido }) => concluido).length;

  return (
    <Tela bordas={['top']}>
      <PixelsDecorativos />
      <ScrollView contentContainerStyle={styles.conteudo} showsVerticalScrollIndicator={false}>
        <CabecalhoTela titulo="Agenda" />
        <Text style={styles.mes}>novembro 2026</Text>

        <View style={styles.semana}>
          {semana.map(({ sigla, dia }) => (
            <View key={sigla} style={styles.coluna}>
              <Text style={styles.sigla}>{sigla}</Text>
              <MolduraPixel
                corFundo={dia === diaSelecionado ? cores.roxo : 'transparent'}
                pixel={3}
                degraus={1}
                style={styles.dia}
              >
                <Text style={styles.numeroDia}>{dia}</Text>
              </MolduraPixel>
            </View>
          ))}
        </View>

        <View style={styles.cabecalhoLista}>
          <Text style={styles.secao}>Hábitos do dia</Text>
          <Text style={styles.contagem}>{`${concluidos} de ${habitosDoDia.length}`}</Text>
        </View>
        {habitosDoDia.map(({ id, nome, icone, concluido }) => (
          <ItemHabito
            key={id}
            nome={nome}
            icone={icone}
            concluido={concluido}
            aoMarcar={() => alternarConcluido(id)}
          />
        ))}
      </ScrollView>
      <BarraInferior abaAtiva="Agenda" />
    </Tela>
  );
}

const styles = StyleSheet.create({
  conteudo: {
    padding: 20,
    paddingTop: 48,
  },
  mes: {
    color: cores.branco,
    fontSize: 30,
    fontFamily: fontes.negrito,
    fontVariant: fontes.semLigaduras,
    textAlign: 'center',
    marginTop: 32,
    marginBottom: 16,
  },
  semana: {
    flexDirection: 'row',
    marginBottom: 40,
  },
  coluna: {
    flex: 1,
    alignItems: 'center',
  },
  cabecalhoLista: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  secao: {
    color: cores.branco,
    fontFamily: fontes.negrito,
    fontVariant: fontes.semLigaduras,
    fontSize: 24,
  },
  contagem: {
    color: cores.roxo,
    fontFamily: fontes.negrito,
    fontVariant: fontes.semLigaduras,
    fontSize: 17,
  },
  sigla: {
    color: cores.roxo,
    fontFamily: fontes.regular,
    fontVariant: fontes.semLigaduras,
    fontSize: 19,
    marginBottom: 8,
  },
  dia: {
    width: 32,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numeroDia: {
    color: cores.branco,
    fontFamily: fontes.regular,
    fontVariant: fontes.semLigaduras,
    fontSize: 20,
  },
});
