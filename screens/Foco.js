import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useKeepAwake } from 'expo-keep-awake';
import Tela from '../components/Tela';
import CabecalhoTela from '../components/CabecalhoTela';
import AnelProgresso from '../components/AnelProgresso';
import MascoteRevi from '../components/MascoteRevi';
import MolduraPixel from '../components/MolduraPixel';
import IconePixel from '../components/IconePixel';
import Botao from '../components/Botao';
import BalaoFala from '../components/BalaoFala';
import Pressionavel from '../components/Pressionavel';
import { useHabitos } from '../contexto/HabitosContexto';
import { cores, fontes } from '../styles/tema';
import { XP_POR_FOCO } from '../utils/estatisticas';
import { indiceSemana } from '../utils/datas';
import { tocar } from '../utils/sons';
import { sucesso } from '../utils/tato';

const duracoes = [5, 15, 25, 45];

const falas = {
  pronto: 'Escolhe um hábito e bora focar juntos!',
  rodando: 'Shhh… focando. Deixa o celular de lado!',
  pausado: 'Pausa rápida? Tô esperando.',
  concluido: `Conseguimos! +${XP_POR_FOCO} XP pra gente.`,
};

const humores = { pronto: 'feliz', rodando: 'neutro', pausado: 'dormindo', concluido: 'radiante' };

const formatar = (ms) => {
  const segundos = Math.ceil(ms / 1000);
  const minutos = Math.floor(segundos / 60);
  return `${String(minutos).padStart(2, '0')}:${String(segundos % 60).padStart(2, '0')}`;
};

// Mantém a tela acesa só enquanto este componente estiver montado.
function TelaAcesa() {
  useKeepAwake();
  return null;
}

export default function Foco({ navigation, route }) {
  const { habitos, revi, estatisticas, registrarFoco, concluirSessao } = useHabitos();
  // Sessão de projeto vinda da aba Projetos (opcional).
  const sessao = route.params?.sessao;
  const deHoje = habitos.filter(({ frequencia }) => frequencia.includes(indiceSemana(new Date())));
  const sugerido = sessao
    ? null
    : (route.params?.habitoId ?? deHoje.find(({ concluido }) => !concluido)?.id ?? null);
  const minutosIniciais = sessao?.minutos ?? 25;
  const opcoesDuracao = [...new Set([...duracoes, minutosIniciais])].sort((a, b) => a - b);

  const [habitoId, setHabitoId] = useState(sugerido);
  const [minutos, setMinutos] = useState(minutosIniciais);
  const [estado, setEstado] = useState('pronto');
  const [fimEm, setFimEm] = useState(0);
  const [restante, setRestante] = useState(minutosIniciais * 60 * 1000);

  const total = minutos * 60 * 1000;
  const habito = habitos.find(({ id }) => id === habitoId);

  // Enquanto roda, atualiza o relógio; o tempo vem do horário final, então não atrasa em segundo plano.
  useEffect(() => {
    if (estado !== 'rodando') {
      return undefined;
    }
    const relogio = setInterval(() => {
      const falta = fimEm - Date.now();
      if (falta <= 0) {
        setRestante(0);
        setEstado('concluido');
        tocar('focoFim');
        sucesso();
        registrarFoco(minutos, habitoId);
        if (sessao) {
          concluirSessao(sessao.projetoId, sessao.sessaoId);
        }
      } else {
        setRestante(falta);
      }
    }, 250);
    return () => clearInterval(relogio);
  }, [estado, fimEm, minutos, habitoId, registrarFoco, sessao, concluirSessao]);

  const escolherDuracao = (valor) => {
    setMinutos(valor);
    setRestante(valor * 60 * 1000);
  };

  const comecar = () => {
    tocar('focoInicio');
    setFimEm(Date.now() + restante);
    setEstado('rodando');
  };

  const pausar = () => setEstado('pausado');

  const recomecar = () => {
    setEstado('pronto');
    setRestante(total);
  };

  const sair = () => {
    if (estado === 'rodando' || estado === 'pausado') {
      Alert.alert('Desistir do foco?', 'O tempo desta sessão não vai contar.', [
        { text: 'Continuar focando', style: 'cancel' },
        { text: 'Desistir', style: 'destructive', onPress: () => navigation.goBack() },
      ]);
      return;
    }
    navigation.goBack();
  };

  const configurando = estado === 'pronto';

  return (
    <Tela bordas={['top', 'bottom']}>
      {estado === 'rodando' ? <TelaAcesa /> : null}
      <View style={styles.cabecalho}>
        <CabecalhoTela titulo="Modo foco" mostrarVoltar aoVoltar={sair} />
      </View>
      <ScrollView contentContainerStyle={styles.conteudo} showsVerticalScrollIndicator={false}>
        <View style={styles.relogio}>
          <AnelProgresso
            progresso={1 - restante / total}
            bloco={18}
            texto={formatar(restante)}
            tamanhoTexto={34}
            cor={estado === 'concluido' ? cores.amarelo : cores.principal}
          />
          <Text style={styles.alvo} numberOfLines={1}>
            {sessao
              ? `${sessao.titulo} · ${minutos} min`
              : habito
                ? `${habito.nome} · ${minutos} min`
                : `Foco livre · ${minutos} min`}
          </Text>
        </View>

        <View style={styles.conversa}>
          <MascoteRevi humor={humores[estado]} aparencia={revi} bloco={5} />
          <BalaoFala texto={falas[estado]} falando={estado !== 'pronto'} />
        </View>

        {configurando ? (
          <>
            {sessao ? null : (
              <>
                <Text style={styles.rotulo}>Focar em</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.chips}
                >
                  {[{ id: null, nome: 'Livre', icone: 'sparkle' }, ...habitos].map((opcao) => {
                    const selecionado = opcao.id === habitoId;
                    return (
                      <Pressionavel
                        key={opcao.id ?? 'livre'}
                        aoPressionar={() => setHabitoId(opcao.id)}
                        escala={0.9}
                        vibracaoSoltar="selecao"
                        som="navegar"
                        accessibilityRole="radio"
                        accessibilityState={{ selected: selecionado }}
                      >
                        <MolduraPixel
                          corFundo={selecionado ? cores.sucesso : cores.cartao}
                          pixel={3}
                          degraus={1}
                        >
                          <View style={styles.chip}>
                            <IconePixel
                              nome={opcao.icone}
                              tamanho={18}
                              cor={selecionado ? cores.preto : cores.branco}
                            />
                            <Text style={[styles.textoChip, selecionado && styles.textoChipAtivo]}>
                              {opcao.nome}
                            </Text>
                          </View>
                        </MolduraPixel>
                      </Pressionavel>
                    );
                  })}
                </ScrollView>
              </>
            )}

            <Text style={styles.rotulo}>Duração</Text>
            <View style={styles.duracoes}>
              {opcoesDuracao.map((valor) => {
                const selecionado = valor === minutos;
                return (
                  <Pressionavel
                    key={valor}
                    style={styles.duracao}
                    aoPressionar={() => escolherDuracao(valor)}
                    escala={0.88}
                    vibracaoSoltar="selecao"
                    som="navegar"
                    accessibilityRole="radio"
                    accessibilityState={{ selected: selecionado }}
                  >
                    <MolduraPixel
                      corFundo={selecionado ? cores.sucesso : cores.cartao}
                      pixel={3}
                      degraus={1}
                      style={styles.blocoDuracao}
                    >
                      <Text style={[styles.textoChip, selecionado && styles.textoChipAtivo]}>
                        {`${valor} min`}
                      </Text>
                    </MolduraPixel>
                  </Pressionavel>
                );
              })}
            </View>
          </>
        ) : null}

        <View style={styles.acoes}>
          {estado === 'pronto' ? <Botao texto="Começar foco" aoPressionar={comecar} /> : null}
          {estado === 'rodando' ? (
            <Botao texto="Pausar" variante="claro" aoPressionar={pausar} />
          ) : null}
          {estado === 'pausado' ? (
            <>
              <Botao texto="Continuar" aoPressionar={comecar} />
              <Botao texto="Recomeçar" variante="claro" aoPressionar={recomecar} />
            </>
          ) : null}
          {estado === 'concluido' ? (
            <>
              <Botao texto="Voltar" aoPressionar={() => navigation.goBack()} />
              <Botao texto="Focar de novo" variante="claro" aoPressionar={recomecar} />
            </>
          ) : null}
        </View>

        <Text style={styles.resumo}>
          {`Total: ${estatisticas.minutosFoco} min em ${estatisticas.sessoesFoco} ${
            estatisticas.sessoesFoco === 1 ? 'sessão' : 'sessões'
          }`}
        </Text>
      </ScrollView>
    </Tela>
  );
}

const styles = StyleSheet.create({
  cabecalho: {
    paddingHorizontal: 20,
    paddingTop: 48,
  },
  conteudo: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  relogio: {
    alignItems: 'center',
  },
  alvo: {
    color: cores.cinzaClaro,
    fontFamily: fontes.media,
    fontVariant: fontes.semLigaduras,
    fontSize: 16,
    marginTop: 12,
  },
  conversa: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
  },
  rotulo: {
    color: cores.branco,
    fontFamily: fontes.negrito,
    fontVariant: fontes.semLigaduras,
    fontSize: 18,
    marginTop: 18,
    marginBottom: 10,
  },
  chips: {
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    height: 38,
  },
  textoChip: {
    color: cores.branco,
    fontFamily: fontes.media,
    fontVariant: fontes.semLigaduras,
    fontSize: 15,
  },
  textoChipAtivo: {
    color: cores.preto,
  },
  duracoes: {
    flexDirection: 'row',
    gap: 8,
  },
  duracao: {
    flex: 1,
  },
  blocoDuracao: {
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acoes: {
    marginTop: 22,
  },
  resumo: {
    color: cores.cinza,
    fontFamily: fontes.regular,
    fontVariant: fontes.semLigaduras,
    fontSize: 13,
    textAlign: 'center',
    marginTop: 10,
  },
});
