import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CampoTexto from './CampoTexto';
import { cores } from '../styles/tema';

const diasSemana = ['s', 't', 'q', 'q', 's', 's', 'd'];

export default function FormularioHabito({ nome, categoria, frequencia = [], lembrete }) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={require('../assets/imagens/habito-badge.png')} style={styles.badge} />

      <Text style={styles.rotulo}>Nome do hábito</Text>
      <CampoTexto placeholder="Nome do hábito" value={nome} />

      <Text style={styles.rotulo}>Categoria</Text>
      <View style={styles.seletor}>
        <Image source={require('../assets/icones/fogo.png')} style={styles.iconeCategoria} />
        <Text style={styles.textoSeletor}>{categoria}</Text>
        <MaterialCommunityIcons name="menu-down" size={28} color={cores.preto} />
      </View>

      <Text style={styles.rotulo}>Frequência</Text>
      <View style={styles.dias}>
        {diasSemana.map((dia, indice) => (
          <View
            key={`${dia}-${indice}`}
            style={[styles.dia, frequencia.includes(indice) && styles.diaSelecionado]}
          >
            <Text style={styles.textoDia}>{dia}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.rotulo}>Lembrete</Text>
      <View style={styles.seletor}>
        <MaterialCommunityIcons name="calendar-blank-outline" size={22} color={cores.preto} />
        <Text style={styles.textoSeletor}>{lembrete}</Text>
      </View>
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
  seletor: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: cores.branco,
    borderTopWidth: 4,
    borderTopColor: '#c8c8d0',
    borderRadius: 4,
    paddingHorizontal: 12,
    height: 46,
    marginVertical: 10,
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
    borderRadius: 6,
    backgroundColor: cores.branco,
    alignItems: 'center',
    justifyContent: 'center',
  },
  diaSelecionado: {
    backgroundColor: cores.roxo,
  },
  textoDia: {
    fontSize: 18,
    color: cores.preto,
  },
});
