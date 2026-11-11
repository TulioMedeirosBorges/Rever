import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Tela from '../components/Tela';
import MolduraPixel from '../components/MolduraPixel';
import IconePixel from '../components/IconePixel';
import BarraProgresso from '../components/BarraProgresso';
import FaixaArcoIris from '../components/FaixaArcoIris';
import Entrada from '../components/Entrada';
import { useHabitos } from '../contexto/HabitosContexto';
import { cores, fontes } from '../styles/tema';

export default function Conquistas() {
  const { conquistas, estatisticas } = useHabitos();
  const abertas = conquistas.filter(({ desbloqueada }) => desbloqueada).length;
  // Abertas primeiro; das fechadas, as mais perto de abrir vêm antes.
  const ordenadas = [...conquistas].sort(
    (a, b) =>
      Number(b.desbloqueada) - Number(a.desbloqueada) || b.atual / b.meta - a.atual / a.meta,
  );

  return (
    <Tela bordas={['bottom']}>
      <ScrollView contentContainerStyle={styles.conteudo} showsVerticalScrollIndicator={false}>
        <MolduraPixel corFundo={cores.cartao} corTopo={cores.sombra} pixel={6}>
          <View style={styles.resumo}>
            <IconePixel nome="trophy" tamanho={56} cor={cores.amarelo} />
            <View style={styles.textosResumo}>
              <Text style={styles.contagem}>
                {abertas}
                <Text style={styles.total}>{` de ${conquistas.length}`}</Text>
              </Text>
              <Text style={styles.legenda}>conquistas desbloqueadas</Text>
              <BarraProgresso feitos={abertas} total={conquistas.length} cor={cores.amarelo} />
            </View>
          </View>
        </MolduraPixel>

        <View style={styles.numeros}>
          <Text style={styles.numero}>{`${estatisticas.totalFeitos} feitos`}</Text>
          <Text style={styles.numero}>{`${estatisticas.diasPerfeitos} dias perfeitos`}</Text>
          <Text style={styles.numero}>{`recorde ${estatisticas.melhorSequencia} dias`}</Text>
        </View>
        <FaixaArcoIris />

        <View style={styles.grade}>
          {ordenadas.map(
            ({ id, nome, descricao, icone, cor, meta, atual, desbloqueada }, indice) => (
              <Entrada key={id} ordem={indice} tipo="escala" mola="quique" style={styles.cartao}>
                <MolduraPixel
                  corFundo={desbloqueada ? cores.cartaoDestaque : cores.cartao}
                  pixel={3}
                >
                  <View style={styles.interno}>
                    <MolduraPixel
                      corFundo={desbloqueada ? cores.fundo : cores.trilha}
                      pixel={3}
                      degraus={1}
                      style={styles.selo}
                    >
                      <IconePixel
                        nome={desbloqueada ? icone : 'lock'}
                        tamanho={30}
                        cor={desbloqueada ? cor : cores.cinza}
                      />
                    </MolduraPixel>
                    <Text style={[styles.nome, !desbloqueada && styles.apagado]} numberOfLines={1}>
                      {nome}
                    </Text>
                    <Text style={styles.descricao} numberOfLines={2}>
                      {descricao}
                    </Text>
                    {desbloqueada ? (
                      <Text style={[styles.status, { color: cor }]}>Desbloqueada</Text>
                    ) : (
                      <View style={styles.progresso}>
                        <BarraProgresso
                          feitos={Math.round((atual / meta) * 6)}
                          total={6}
                          cor={cores.cinzaClaro}
                        />
                        <Text style={styles.fracao}>{`${atual}/${meta}`}</Text>
                      </View>
                    )}
                  </View>
                </MolduraPixel>
              </Entrada>
            ),
          )}
        </View>
      </ScrollView>
    </Tela>
  );
}

const styles = StyleSheet.create({
  conteudo: {
    padding: 20,
  },
  resumo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 24,
  },
  textosResumo: {
    flex: 1,
    marginLeft: 18,
  },
  contagem: {
    color: cores.amarelo,
    fontFamily: fontes.negrito,
    fontVariant: fontes.semLigaduras,
    fontSize: 34,
  },
  total: {
    color: cores.branco,
    fontSize: 20,
  },
  legenda: {
    color: cores.cinzaClaro,
    fontFamily: fontes.regular,
    fontVariant: fontes.semLigaduras,
    fontSize: 15,
    marginBottom: 10,
  },
  numeros: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
    marginBottom: 8,
  },
  numero: {
    color: cores.cinzaClaro,
    fontFamily: fontes.media,
    fontVariant: fontes.semLigaduras,
    fontSize: 13,
  },
  grade: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cartao: {
    width: '48%',
    marginBottom: 12,
  },
  interno: {
    alignItems: 'center',
    padding: 12,
    paddingTop: 16,
  },
  selo: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  nome: {
    color: cores.branco,
    fontFamily: fontes.negrito,
    fontVariant: fontes.semLigaduras,
    fontSize: 16,
  },
  apagado: {
    color: cores.cinzaClaro,
  },
  descricao: {
    color: cores.cinza,
    fontFamily: fontes.regular,
    fontVariant: fontes.semLigaduras,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 2,
    minHeight: 30,
  },
  status: {
    fontFamily: fontes.media,
    fontVariant: fontes.semLigaduras,
    fontSize: 13,
    marginTop: 8,
  },
  progresso: {
    alignSelf: 'stretch',
    marginTop: 10,
  },
  fracao: {
    color: cores.cinza,
    fontFamily: fontes.media,
    fontVariant: fontes.semLigaduras,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
});
