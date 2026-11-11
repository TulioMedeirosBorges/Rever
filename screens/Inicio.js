import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import Tela from '../components/Tela';
import PixelsDecorativos from '../components/PixelsDecorativos';
import IconeProprio from '../components/IconeProprio';
import MolduraPixel from '../components/MolduraPixel';
import FaixaArcoIris from '../components/FaixaArcoIris';
import ItemHabito from '../components/ItemHabito';
import BarraInferior from '../components/BarraInferior';
import { habitos } from '../data/habitos';
import { cores, fontes } from '../styles/tema';

const diasSemana = ['s', 't', 'q', 'q', 's', 's', 'd'];

export default function Inicio({ navigation }) {
  const concluidos = habitos.filter((habito) => habito.concluido).length;
  const porcentagem = Math.round((concluidos / habitos.length) * 100);

  return (
    <Tela bordas={['top']}>
      <PixelsDecorativos />
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
              <Text style={styles.porcentagem}>{`${porcentagem}%`}</Text>
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
    fontSize: 33,
    fontFamily: fontes.negrito,
    fontVariant: fontes.semLigaduras,
  },
  subtitulo: {
    color: cores.branco,
    fontFamily: fontes.regular,
    fontVariant: fontes.semLigaduras,
    fontSize: 15,
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
    fontSize: 26,
    fontFamily: fontes.negrito,
    fontVariant: fontes.semLigaduras,
  },
  resumo: {
    flex: 1,
    marginLeft: 20,
  },
  contagem: {
    color: cores.branco,
    fontSize: 22,
    fontFamily: fontes.negrito,
    fontVariant: fontes.semLigaduras,
  },
  textoResumo: {
    color: cores.branco,
    fontFamily: fontes.regular,
    fontVariant: fontes.semLigaduras,
    fontSize: 22,
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
    fontFamily: fontes.regular,
    fontVariant: fontes.semLigaduras,
    fontSize: 11,
  },
  secao: {
    color: cores.branco,
    fontSize: 24,
    fontFamily: fontes.negrito,
    fontVariant: fontes.semLigaduras,
    marginBottom: 12,
  },
});
