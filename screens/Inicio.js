import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Tela from '../components/Tela';
import PixelsDecorativos from '../components/PixelsDecorativos';
import IconePixel from '../components/IconePixel';
import AnelProgresso from '../components/AnelProgresso';
import MolduraPixel from '../components/MolduraPixel';
import FaixaArcoIris from '../components/FaixaArcoIris';
import ItemHabito from '../components/ItemHabito';
import BarraInferior from '../components/BarraInferior';
import { habitos } from '../data/habitos';
import { diasSemana } from '../data/semana';
import { cores, fontes } from '../styles/tema';

export default function Inicio({ navigation }) {
  const concluidos = habitos.filter((habito) => habito.concluido).length;
  const progresso = concluidos / habitos.length;

  return (
    <Tela bordas={['top']}>
      <PixelsDecorativos />
      <ScrollView contentContainerStyle={styles.conteudo} showsVerticalScrollIndicator={false}>
        <View style={styles.topo}>
          <View>
            <Text style={styles.ola}>Olá, Usuário</Text>
            <Text style={styles.subtitulo}>Que tal manter o foco hoje?</Text>
          </View>
          <TouchableOpacity
            style={styles.engrenagem}
            onPress={() => navigation.replace('Perfil')}
            activeOpacity={0.6}
          >
            <IconePixel nome="settings-cog" tamanho={30} cor={cores.branco} />
          </TouchableOpacity>
        </View>
        <FaixaArcoIris />

        <MolduraPixel
          corFundo={cores.cartao}
          corTopo={cores.sombra}
          pixel={6}
          style={styles.molduraCartao}
        >
          <View style={styles.cartao}>
            <AnelProgresso progresso={progresso} />
            <View style={styles.resumo}>
              <Text style={styles.contagem}>{`${concluidos} de ${habitos.length}`}</Text>
              <Text style={styles.textoResumo}>Hábitos{'\n'}concluídos</Text>
              <View style={styles.sequencia}>
                {diasSemana.map((dia, indice) => (
                  <View key={`${dia}-${indice}`} style={styles.diaSequencia}>
                    <IconePixel
                      nome="fire"
                      tamanho={18}
                      cor={indice < 3 ? cores.arcoIris[0] : cores.cinza}
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
    marginTop: 28,
    marginBottom: 14,
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
    padding: 8,
    marginRight: -8,
  },
  molduraCartao: {
    marginTop: 20,
    marginBottom: 20,
  },
  cartao: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 22,
    paddingBottom: 16,
    paddingHorizontal: 22,
  },
  resumo: {
    flex: 1,
    marginLeft: 24,
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
    lineHeight: 24,
    marginBottom: 10,
  },
  sequencia: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  diaSequencia: {
    alignItems: 'center',
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
