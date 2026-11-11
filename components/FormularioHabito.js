import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import IconePixel from './IconePixel';
import CampoTexto from './CampoTexto';
import MolduraPixel from './MolduraPixel';
import { cores } from '../styles/tema';

const diasSemana = ['s', 't', 'q', 'q', 's', 's', 'd'];

export default function FormularioHabito({ nome, categoria, frequencia = [], lembrete }) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={require('../assets/imagens/habito-badge.png')} style={styles.badge} />

      <Text style={styles.rotulo}>Nome do hábito</Text>
      <CampoTexto placeholder="Nome do hábito" value={nome} />

      <Text style={styles.rotulo}>Categoria</Text>
      <MolduraPixel corFundo={cores.branco} corTopo={cores.cinzaClaro} style={styles.moldura}>
        <View style={styles.seletor}>
          <Image source={require('../assets/icones/fogo.png')} style={styles.iconeCategoria} />
          <Text style={styles.textoSeletor}>{categoria}</Text>
          <IconePixel nome="chevron-down" tamanho={24} cor={cores.preto} />
        </View>
      </MolduraPixel>

      <Text style={styles.rotulo}>Frequência</Text>
      <View style={styles.dias}>
        {diasSemana.map((dia, indice) => {
          const selecionado = frequencia.includes(indice);

          return (
            <MolduraPixel
              key={`${dia}-${indice}`}
              corFundo={selecionado ? cores.roxoClaro : cores.branco}
              corTopo={selecionado ? undefined : cores.cinzaClaro}
              pixel={3}
              degraus={1}
              style={styles.dia}
            >
              <Text style={styles.textoDia}>{dia}</Text>
            </MolduraPixel>
          );
        })}
      </View>

      <Text style={styles.rotulo}>Lembrete</Text>
      <MolduraPixel corFundo={cores.branco} corTopo={cores.cinzaClaro} style={styles.moldura}>
        <View style={styles.seletor}>
          <IconePixel nome="calendar" tamanho={22} cor={cores.preto} />
          <Text style={styles.textoSeletor}>{lembrete}</Text>
        </View>
      </MolduraPixel>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 32,
    paddingBottom: 24,
  },
  badge: {
    width: 180,
    height: 160,
    alignSelf: 'center',
    marginBottom: 32,
  },
  rotulo: {
    color: cores.branco,
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
  },
  moldura: {
    marginVertical: 10,
  },
  seletor: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 4,
    height: 46,
  },
  iconeCategoria: {
    width: 22,
    height: 22,
  },
  textoSeletor: {
    flex: 1,
    marginLeft: 10,
    fontSize: 18,
    color: cores.preto,
  },
  dias: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  dia: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoDia: {
    fontSize: 18,
    color: cores.preto,
  },
});
