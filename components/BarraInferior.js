import { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import IconePixel from './IconePixel';
import MolduraPixel from './MolduraPixel';
import Pressionavel from './Pressionavel';
import FaixaArcoIris from './FaixaArcoIris';
import CantosPixel from './CantosPixel';
import { useHabitos } from '../contexto/HabitosContexto';
import { cores, fontes } from '../styles/tema';
import { chaveDia, indiceSemana } from '../utils/datas';
import { molas } from '../utils/movimento';
import { chaveHabito, chaveSessao } from '../utils/prazos';

// Ordem das posições na barra; o "+" fica no meio e não é uma aba.
const posicoes = [
  { nome: 'Inicio', rotulo: 'Início', icone: 'home', cor: cores.vermelho },
  { nome: 'Agenda', rotulo: 'Agenda', icone: 'calendar-2', cor: cores.laranja },
  { nome: 'Conversar', rotulo: 'Revi', icone: 'message-text', cor: cores.amarelo },
  { nome: 'CriarHabito' },
  { nome: 'Projetos', rotulo: 'Projetos', icone: 'clipboard-note', cor: cores.turquesa },
  { nome: 'Progresso', rotulo: 'Progresso', icone: 'chart', cor: cores.creme },
  { nome: 'Perfil', rotulo: 'Perfil', icone: 'user', cor: cores.cinzaClaro },
];

// Espaço acima da barra para o "+" saltado. Fica dentro do componente para o toque
// funcionar também no Android (fora da área do pai o Android não recebe o toque).
const ELEVACAO = 16;
const ALTURA_BASE = 4;

// Selos: quanto falta hoje (hábitos + sessões) e se há sessão de projeto hoje.
function useSelos() {
  const { habitos, projetos, puladosHoje } = useHabitos();
  const hoje = new Date();
  // O que a pessoa confirmou que não vai fazer hoje não conta como pendente.
  const faltam = habitos.filter(
    (habito) =>
      habito.frequencia.includes(indiceSemana(hoje)) &&
      !habito.concluido &&
      !puladosHoje.includes(chaveHabito(habito)),
  ).length;
  const sessoesHoje = projetos.reduce(
    (soma, projeto) =>
      soma +
      projeto.sessoes.filter(
        (sessao) =>
          sessao.data === chaveDia(hoje) &&
          !sessao.feita &&
          !puladosHoje.includes(chaveSessao(projeto, sessao)),
      ).length,
    0,
  );
  // O selo da Início soma hábitos e sessões de projeto que ainda faltam hoje.
  const total = faltam + sessoesHoje;
  return { Inicio: total > 0 ? String(total) : null, Projetos: sessoesHoje > 0 ? '' : null };
}

// Barra fixa das abas (usada pelo navegador de abas no lugar da barra padrão).
export default function BarraInferior({ state, navigation, insets }) {
  const [largura, setLargura] = useState(0);
  const selos = useSelos();
  const abaAtual = state.routes[state.index].name;
  const posicaoAtual = posicoes.findIndex(({ nome }) => nome === abaAtual);
  const deslize = useRef(new Animated.Value(posicaoAtual)).current;

  // O destaque desliza com mola até a aba escolhida.
  useEffect(() => {
    Animated.spring(deslize, {
      toValue: posicaoAtual,
      useNativeDriver: true,
      ...molas.viva,
    }).start();
  }, [deslize, posicaoAtual]);

  const larguraCasa = largura / posicoes.length;
  const translateX = deslize.interpolate({
    inputRange: [0, posicoes.length - 1],
    outputRange: [0, larguraCasa * (posicoes.length - 1)],
  });

  const abrir = (route) => {
    const evento = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });
    if (route.name !== abaAtual && !evento.defaultPrevented) {
      navigation.navigate(route.name);
    }
  };

  return (
    <View style={styles.area} pointerEvents="box-none">
      <View style={[styles.fundo, { top: ELEVACAO }]} pointerEvents="none">
        <FaixaArcoIris altura={4} />
        <View style={styles.corBarra} />
        <CantosPixel />
      </View>

      <View
        style={[styles.linha, { paddingBottom: 8 + insets.bottom }]}
        onLayout={({ nativeEvent }) => setLargura(nativeEvent.layout.width)}
        pointerEvents="box-none"
      >
        {largura > 0 && posicaoAtual >= 0 ? (
          <Animated.View
            pointerEvents="none"
            style={[styles.destaque, { width: larguraCasa, transform: [{ translateX }] }]}
          >
            <MolduraPixel
              corFundo={cores.cartaoDestaque}
              corTopo={posicoes[posicaoAtual].cor}
              pixel={3}
              style={styles.blocoDestaque}
            />
          </Animated.View>
        ) : null}

        {posicoes.map((posicao) => {
          if (posicao.nome === 'CriarHabito') {
            return (
              <View key="mais" style={styles.casaMais} pointerEvents="box-none">
                <View style={styles.mais}>
                  <MolduraPixel corFundo="#a8916a" pixel={3} style={styles.baseMais} />
                  <Pressionavel
                    aoPressionar={() => navigation.navigate('CriarHabito')}
                    vibracaoApertar="apertar"
                    escala={1}
                    afundar={ALTURA_BASE}
                    accessibilityRole="button"
                    accessibilityLabel="Criar hábito"
                  >
                    <MolduraPixel corFundo={cores.principal} pixel={3} style={styles.botaoMais}>
                      <IconePixel nome="plus" tamanho={28} cor={cores.preto} />
                    </MolduraPixel>
                  </Pressionavel>
                </View>
              </View>
            );
          }

          const route = state.routes.find(({ name }) => name === posicao.nome);
          const ativa = posicao.nome === abaAtual;
          const corAtual = ativa ? posicao.cor : cores.cinza;
          const selo = selos[posicao.nome];

          return (
            <Pressionavel
              key={posicao.nome}
              style={styles.casa}
              aoPressionar={() => abrir(route)}
              escala={0.84}
              vibracaoSoltar="selecao"
              som="navegar"
              accessibilityRole="tab"
              accessibilityState={{ selected: ativa }}
              accessibilityLabel={posicao.rotulo}
            >
              <View>
                <IconePixel nome={posicao.icone} tamanho={ativa ? 28 : 24} cor={corAtual} />
                {selo !== null && selo !== undefined ? (
                  <View style={[styles.selo, selo === '' && styles.seloPonto]}>
                    {selo !== '' ? <Text style={styles.textoSelo}>{selo}</Text> : null}
                  </View>
                ) : null}
              </View>
              {/* Só a aba ativa mostra o nome; o espaço fica reservado para nada pular. */}
              <Text
                style={[styles.rotulo, { color: ativa ? corAtual : 'transparent' }]}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                {posicao.rotulo}
              </Text>
            </Pressionavel>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  area: {
    paddingTop: ELEVACAO,
  },
  fundo: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  corBarra: {
    flex: 1,
    backgroundColor: cores.barra,
  },
  linha: {
    flexDirection: 'row',
    paddingTop: 10,
  },
  destaque: {
    position: 'absolute',
    top: 4,
    left: 0,
    alignItems: 'center',
  },
  blocoDestaque: {
    width: 46,
    height: 54,
  },
  casa: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 54,
  },
  rotulo: {
    fontFamily: fontes.media,
    fontVariant: fontes.semLigaduras,
    fontSize: 11,
    marginTop: 2,
  },
  selo: {
    position: 'absolute',
    top: -6,
    right: -10,
    minWidth: 16,
    height: 16,
    paddingHorizontal: 3,
    backgroundColor: cores.vermelho,
    alignItems: 'center',
    justifyContent: 'center',
  },
  seloPonto: {
    top: -3,
    right: -5,
    minWidth: 8,
    width: 8,
    height: 8,
    paddingHorizontal: 0,
    backgroundColor: cores.laranja,
  },
  textoSelo: {
    color: cores.branco,
    fontFamily: fontes.negrito,
    fontVariant: fontes.semLigaduras,
    fontSize: 10,
  },
  casaMais: {
    flex: 1,
    alignItems: 'center',
  },
  // O "+" sobe para fora da barra, ocupando o espaço reservado acima dela.
  mais: {
    marginTop: -ELEVACAO - 8,
    paddingBottom: ALTURA_BASE,
  },
  baseMais: {
    position: 'absolute',
    top: ALTURA_BASE,
    bottom: 0,
    left: 0,
    right: 0,
  },
  botaoMais: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
