import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Tela from '../components/Tela';
import CabecalhoTela from '../components/CabecalhoTela';
import ItemHabito from '../components/ItemHabito';
import MolduraPixel from '../components/MolduraPixel';
import BarraInferior from '../components/BarraInferior';
import { habitos } from '../data/habitos';
import { cores } from '../styles/tema';

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
  const diaSelecionado = 13;

  return (
    <Tela>
      <ScrollView contentContainerStyle={styles.conteudo}>
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

        {habitos.slice(0, 3).map(({ id, nome, icone, concluido }) => (
          <ItemHabito key={id} nome={nome} icone={icone} concluido={concluido} />
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
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 32,
    marginBottom: 16,
  },
  semana: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 72,
  },
  coluna: {
    alignItems: 'center',
  },
  sigla: {
    color: cores.roxo,
    fontSize: 15,
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
    fontSize: 16,
  },
});
