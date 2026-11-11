import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Tela from '../components/Tela';
import PixelsDecorativos from '../components/PixelsDecorativos';
import CabecalhoTela from '../components/CabecalhoTela';
import MolduraPixel from '../components/MolduraPixel';
import IconePixel from '../components/IconePixel';
import CartaoEstatistica from '../components/CartaoEstatistica';
import BarraProgresso from '../components/BarraProgresso';
import BarraInferior from '../components/BarraInferior';
import { useHabitos } from '../contexto/HabitosContexto';
import { cores, fontes } from '../styles/tema';
import Pressionavel from '../components/Pressionavel';

const ALTURA_GRAFICO = 130;

const corDaBarra = (indice) => cores.arcoIris[indice % (cores.arcoIris.length - 1)];

const graficos = {
  sem: [
    { rotulo: 'SEG', valor: 8 },
    { rotulo: 'TER', valor: 5 },
    { rotulo: 'QUA', valor: 8 },
    { rotulo: 'QUI', valor: 5 },
    { rotulo: 'SEX', valor: 8 },
    { rotulo: 'SAB', valor: 6 },
    { rotulo: 'DOM', valor: 4 },
  ],
  mês: [
    { rotulo: 'S1', valor: 38 },
    { rotulo: 'S2', valor: 44 },
    { rotulo: 'S3', valor: 31 },
    { rotulo: 'S4', valor: 47 },
  ],
  ano: [
    { rotulo: 'J', valor: 120 },
    { rotulo: 'F', valor: 98 },
    { rotulo: 'M', valor: 135 },
    { rotulo: 'A', valor: 110 },
    { rotulo: 'M', valor: 150 },
    { rotulo: 'J', valor: 142 },
    { rotulo: 'J', valor: 160 },
    { rotulo: 'A', valor: 128 },
    { rotulo: 'S', valor: 155 },
    { rotulo: 'O', valor: 170 },
    { rotulo: 'N', valor: 90 },
    { rotulo: 'D', valor: 0 },
  ],
};

const periodos = Object.keys(graficos);

export default function Progresso() {
  const { habitos } = useHabitos();
  const [periodo, setPeriodo] = useState('sem');

  const dados = graficos[periodo];
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
              <View key={`${rotulo}-${indice}`} style={styles.colunaGrafico}>
                {altura > 0 ? (
                  <>
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
                  </>
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
          <IconePixel nome="fire" tamanho={72} cor={cores.laranja} style={styles.fogo} />
          <View>
            <Text style={styles.numero}>
              5 <Text style={styles.dias}>dias</Text>
            </Text>
            <Text style={styles.recorde}>Recorde: 12 dias</Text>
          </View>
        </View>

        <View style={styles.estatisticas}>
          <CartaoEstatistica
            icone="check"
            valor="85%"
            rotulo="Taxa de conclusão"
            cor={cores.turquesa}
          />
          <CartaoEstatistica
            icone="trophy"
            valor="42"
            rotulo="Hábitos feitos"
            cor={cores.amarelo}
          />
          <CartaoEstatistica icone="zap" valor="12" rotulo="Melhor sequência" cor={cores.laranja} />
        </View>

        <Text style={styles.secao}>Por hábito</Text>
        {habitos.map(({ id, nome, icone, feitosNaSemana }) => (
          <MolduraPixel key={id} corFundo={cores.cartao} pixel={3} style={styles.molduraHabito}>
            <View style={styles.habito}>
              <View style={styles.linhaHabito}>
                <IconePixel nome={icone} tamanho={20} cor={cores.branco} />
                <Text style={styles.nomeHabito}>{nome}</Text>
                <Text style={styles.contagemHabito}>{`${feitosNaSemana}/7`}</Text>
              </View>
              <BarraProgresso feitos={feitosNaSemana} total={7} />
            </View>
          </MolduraPixel>
        ))}
      </ScrollView>
      <BarraInferior abaAtiva="Progresso" />
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
  contagemHabito: {
    color: cores.turquesa,
    fontFamily: fontes.negrito,
    fontVariant: fontes.semLigaduras,
    fontSize: 17,
  },
});
