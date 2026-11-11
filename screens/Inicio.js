import { Image, ImageBackground, ScrollView, StyleSheet, Text, View } from 'react-native';
import Tela from '../components/Tela';
import FaixaArcoIris from '../components/FaixaArcoIris';
import ItemHabito from '../components/ItemHabito';
import BarraInferior from '../components/BarraInferior';
import { habitos } from '../data/habitos';
import { cores } from '../styles/tema';

const diasSemana = ['s', 't', 'q', 'q', 's', 's', 'd'];

export default function Inicio({ navigation }) {
  const concluidos = habitos.filter((habito) => habito.concluido).length;

  return (
    <Tela>
      <ScrollView contentContainerStyle={styles.conteudo}>
        <View style={styles.topo}>
          <View>
            <Text style={styles.ola}>Olá, Usuário</Text>
            <Text style={styles.subtitulo}>Que tal manter o foco hoje?</Text>
          </View>
          <Image source={require('../assets/icones/configuracoes.png')} style={styles.engrenagem} />
        </View>
        <FaixaArcoIris />

        <View style={styles.cartao}>
          <ImageBackground
            source={require('../assets/Icon Propio/Roda da porcentagem.png')}
            style={styles.anel}
            resizeMode="contain"
          >
            <Text style={styles.porcentagem}>50%</Text>
          </ImageBackground>
          <View style={styles.resumo}>
            <Text style={styles.contagem}>{`${concluidos} de ${habitos.length}`}</Text>
            <Text style={styles.textoResumo}>Hábitos{'\n'}concluídos</Text>
            <View style={styles.sequencia}>
              {diasSemana.map((dia, indice) => (
                <View key={`${dia}-${indice}`} style={styles.diaSequencia}>
                  <Image
                    source={require('../assets/icones/fogo-2.png')}
                    style={[styles.fogo, { tintColor: indice < 3 ? cores.arcoIris[0] : cores.cinza }]}
                  />
                  <Text style={styles.letraDia}>{dia}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <Text style={styles.secao}>Seus hábitos</Text>
        {habitos.map(({ id, nome, icone, concluido }) => (
          <ItemHabito
            key={id}
            nome={nome}
            icone={icone}
            concluido={concluido}
            mostrarSeta
            aoPressionar={() => navigation.navigate('EditarHabito', { id })}
          />
        ))}
      </ScrollView>
      <BarraInferior abaAtiva="Inicio" />
    </Tela>
  );
}

const styles = StyleSheet.create({
  conteudo: {
    padding: 20,
  },
  topo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  ola: {
    color: cores.branco,
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitulo: {
    color: cores.branco,
    fontSize: 13,
  },
  engrenagem: {
    width: 32,
    height: 32,
    tintColor: cores.branco,
  },
  cartao: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: cores.cartao,
    borderRadius: 10,
    padding: 16,
    marginTop: 20,
    marginBottom: 20,
  },
  anel: {
    width: 123,
    height: 121,
    alignItems: 'center',
    justifyContent: 'center',
  },
  porcentagem: {
    color: cores.branco,
    fontSize: 22,
    fontWeight: 'bold',
  },
  resumo: {
    flex: 1,
    marginLeft: 20,
  },
  contagem: {
    color: cores.branco,
    fontSize: 18,
    fontWeight: 'bold',
  },
  textoResumo: {
    color: cores.branco,
    fontSize: 18,
    marginBottom: 6,
  },
  sequencia: {
    flexDirection: 'row',
  },
  diaSequencia: {
    alignItems: 'center',
    marginRight: 4,
  },
  fogo: {
    width: 16,
    height: 16,
  },
  letraDia: {
    color: cores.cinza,
    fontSize: 10,
  },
  secao: {
    color: cores.branco,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
});
