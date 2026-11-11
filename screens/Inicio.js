import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import Tela from '../components/Tela';
import IconeProprio from '../components/IconeProprio';
import MolduraPixel from '../components/MolduraPixel';
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

        <MolduraPixel
          corFundo={cores.cartao}
          corTopo={cores.sombra}
          pixel={6}
          style={styles.molduraCartao}
        >
          <View style={styles.cartao}>
            <View style={styles.anel}>
              <IconeProprio nome="roda" tamanho={121} style={StyleSheet.absoluteFill} />
              <Text style={styles.porcentagem}>50%</Text>
            </View>
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
        </MolduraPixel>

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
  molduraCartao: {
    marginTop: 20,
    marginBottom: 20,
  },
  cartao: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 22,
  },
  anel: {
    width: 121,
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
