import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Tela from '../components/Tela';
import PixelsDecorativos from '../components/PixelsDecorativos';
import CabecalhoTela from '../components/CabecalhoTela';
import MolduraPixel from '../components/MolduraPixel';
import IconePixel from '../components/IconePixel';
import CartaoEstatistica from '../components/CartaoEstatistica';
import BarraProgresso from '../components/BarraProgresso';
import { useHabitos } from '../contexto/HabitosContexto';
import { cores, fontes } from '../styles/tema';
import { dadosDoGrafico } from '../utils/estatisticas';
import Pressionavel from '../components/Pressionavel';
import Entrada from '../components/Entrada';

const ALTURA_GRAFICO = 130;

const corDaBarra = (indice) => cores.arcoIris[indice % (cores.arcoIris.length - 1)];

const periodos = ['sem', 'mês', 'ano'];

export default function Progresso() {
  const { habitos, historico, estatisticas } = useHabitos();
  const [periodo, setPeriodo] = useState('sem');

  const dados = dadosDoGrafico(historico, periodo);
  const maiorValor = Math.max(...dados.map(({ valor }) => valor));
  const larguraBarra = periodo === 'ano' ? 16 : 24;

  return (
    <Tela bordas={['top']}>
      <PixelsDecorativos />
      <ScrollView contentContainerStyle={styles.conteudo} showsVerticalScrollIndicator={false}>
        <CabecalhoTela titulo="Seu progresso" />

        <MolduraPixel corFundo={cores.cartao} pixel={3} style={styles.molduraPeriodos}>
          <View style={styles.periodos}>
            {periodos.map((item) => (
              <Pressionavel
                key={item}
                style={styles.periodo}
                aoPressionar={() => setPeriodo(item)}
                escala={0.92}
                vibracaoSoltar="selecao"
                som="navegar"
              >
                <MolduraPixel
                  corFundo={item === periodo ? cores.cartaoDestaque : 'transparent'}
                  pixel={3}
                  style={styles.opcaoPeriodo}
                >
                  <Text style={styles.textoPeriodo}>{item}</Text>
                </MolduraPixel>
              </Pressionavel>
            ))}
          </View>
        </MolduraPixel>

        <View style={styles.grafico}>
          {dados.map(({ rotulo, valor }, indice) => {
            const altura = maiorValor > 0 ? (valor / maiorValor) * ALTURA_GRAFICO : 0;

            return (
              // A chave inclui o período: trocar sem/mês/ano faz as barras crescerem de novo.
              <View key={`${periodo}-${rotulo}-${indice}`} style={styles.colunaGrafico}>
                {altura > 0 ? (
                  <Entrada tipo="crescer" ordem={indice} mola="quique" style={styles.colunaGrafico}>
                    <View
                      style={[
                        styles.topoBarra,
                        { width: larguraBarra - 6, backgroundColor: corDaBarra(indice) },
                      ]}
                    />
                    <View
                      style={[
                        styles.barra,
                        {
                          height: altura,
                          width: larguraBarra,
                          backgroundColor: corDaBarra(indice),
                        },
                      ]}
                    />
                  </Entrada>
                ) : (
                  <View style={[styles.barraVazia, { width: larguraBarra }]} />
                )}
                <Text style={styles.rotuloGrafico}>{rotulo}</Text>
              </View>
            );
          })}
        </View>

        <Text style={styles.secao}>Sequência atual</Text>
        <View style={styles.sequencia}>
          <Entrada tipo="escala" mola="quique" ordem={4}>
            <IconePixel nome="fire" tamanho={72} cor={cores.laranja} style={styles.fogo} />
          </Entrada>
          <View>
            <Text style={styles.numero}>
              {estatisticas.sequenciaAtual}{' '}
              <Text style={styles.dias}>{estatisticas.sequenciaAtual === 1 ? 'dia' : 'dias'}</Text>
            </Text>
            <Text style={styles.recorde}>{`Recorde: ${estatisticas.melhorSequencia} dias`}</Text>
          </View>
        </View>

        <Entrada ordem={5} style={styles.estatisticas}>
          <CartaoEstatistica
            icone="check"
            valor={`${Math.round(estatisticas.taxaSemana * 100)}%`}
            rotulo="Feito na semana"
            cor={cores.turquesa}
          />
          <CartaoEstatistica
            icone="trophy"
            valor={estatisticas.totalFeitos}
            rotulo="Hábitos feitos"
            cor={cores.amarelo}
          />
          <CartaoEstatistica
            icone="sparkle"
            valor={estatisticas.diasPerfeitos}
            rotulo="Dias perfeitos"
            cor={cores.laranja}
          />
        </Entrada>

        <Text style={styles.secao}>Por hábito</Text>
        <Text style={styles.legendaHabito}>Últimos 7 dias</Text>
        {habitos.map(({ id, nome, icone }) => (
          <MolduraPixel key={id} corFundo={cores.cartao} pixel={3} style={styles.molduraHabito}>
            <View style={styles.habito}>
              <View style={styles.linhaHabito}>
                <IconePixel nome={icone} tamanho={20} cor={cores.branco} />
                <Text style={styles.nomeHabito}>{nome}</Text>
                <Text style={styles.contagemHabito}>
                  {`${estatisticas.porHabito[id].feitos}/${estatisticas.porHabito[id].meta}`}
                </Text>
              </View>
              <BarraProgresso
                feitos={estatisticas.porHabito[id].feitos}
                total={estatisticas.porHabito[id].meta}
              />
            </View>
          </MolduraPixel>
        ))}
      </ScrollView>
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
    marginBottom: 32,
  },
  periodos: {
    flexDirection: 'row',
    padding: 4,
  },
  periodo: {
    flex: 1,
  },
  opcaoPeriodo: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  textoPeriodo: {
    color: cores.branco,
    fontFamily: fontes.regular,
    fontVariant: fontes.semLigaduras,
    fontSize: 28,
  },
  grafico: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    marginBottom: 36,
  },
  colunaGrafico: {
    alignItems: 'center',
  },
  topoBarra: {
    height: 6,
  },
  barra: {},
  barraVazia: {
    height: 4,
    backgroundColor: cores.cartaoDestaque,
  },
  rotuloGrafico: {
    color: cores.branco,
    fontFamily: fontes.regular,
    fontVariant: fontes.semLigaduras,
    fontSize: 16,
    marginTop: 6,
  },
  secao: {
    color: cores.branco,
    fontSize: 28,
    fontFamily: fontes.negrito,
    fontVariant: fontes.semLigaduras,
    marginBottom: 16,
  },
  sequencia: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
  },
  fogo: {
    marginRight: 24,
  },
  numero: {
    color: cores.branco,
    fontSize: 44,
    fontFamily: fontes.negrito,
    fontVariant: fontes.semLigaduras,
  },
  dias: {
    fontSize: 28,
  },
  recorde: {
    color: cores.cinza,
    fontFamily: fontes.regular,
    fontVariant: fontes.semLigaduras,
    fontSize: 15,
  },
  estatisticas: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 32,
  },
  molduraHabito: {
    marginBottom: 10,
  },
  habito: {
    padding: 14,
  },
  linhaHabito: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  nomeHabito: {
    flex: 1,
    color: cores.branco,
    fontFamily: fontes.regular,
    fontVariant: fontes.semLigaduras,
    fontSize: 18,
    marginLeft: 10,
  },
  legendaHabito: {
    color: cores.cinza,
    fontFamily: fontes.regular,
    fontVariant: fontes.semLigaduras,
    fontSize: 14,
    marginTop: -8,
    marginBottom: 12,
  },
  contagemHabito: {
    color: cores.turquesa,
    fontFamily: fontes.negrito,
    fontVariant: fontes.semLigaduras,
    fontSize: 17,
  },
});
