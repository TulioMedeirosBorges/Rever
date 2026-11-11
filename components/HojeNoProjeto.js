import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import MolduraPixel from './MolduraPixel';
import IconePixel from './IconePixel';
import Botao from './Botao';
import Pressionavel from './Pressionavel';
import Entrada from './Entrada';
import BarraProgresso from './BarraProgresso';
import { useHabitos } from '../contexto/HabitosContexto';
import { cores, fontes } from '../styles/tema';
import { chaveDia, rotuloData } from '../utils/datas';
import { formatarDuracao } from '../utils/reviIA';

const ALTURA_BASE = 4;

// A sessão de hoje (ou a próxima, se hoje for dia livre) de um projeto.
export const sessaoDoDia = (projeto) => {
  const hoje = chaveDia(new Date());
  const deHoje = projeto.sessoes.find(({ data }) => data === hoje);
  const proxima = projeto.sessoes.find(({ data, feita }) => data > hoje && !feita);
  return { hoje: deHoje ?? null, proxima: proxima ?? null };
};

// Botão com a cor e o ícone do projeto, dizendo quanto tempo dedicar hoje.
export function BotaoHoje({ projeto, aoPressionar }) {
  const { hoje, proxima } = sessaoDoDia(projeto);
  const cor = projeto.cor ?? cores.turquesa;

  let titulo = 'Hoje: dia livre';
  let detalhe = proxima ? `Próximo foco: ${rotuloData(proxima.data)}` : 'Sem sessões pela frente';
  if (hoje && !hoje.feita) {
    titulo = `Hoje · ${formatarDuracao(hoje.minutos)}`;
    detalhe = hoje.titulo;
  } else if (hoje) {
    titulo = 'Hoje: feito!';
    detalhe = proxima ? `Próximo: ${rotuloData(proxima.data)}` : 'Projeto em dia';
  }

  return (
    <View style={styles.botao}>
      <MolduraPixel corFundo={cores.sombra} pixel={3} style={styles.base} />
      <Pressionavel
        aoPressionar={aoPressionar}
        escala={1}
        afundar={ALTURA_BASE}
        vibracaoApertar="apertar"
        accessibilityRole="button"
        accessibilityLabel={`${titulo}. ${detalhe}`}
      >
        <MolduraPixel corFundo={cor} pixel={3}>
          <View style={styles.conteudoBotao}>
            <MolduraPixel corFundo={cores.fundo} pixel={2} degraus={1} style={styles.icone}>
              <IconePixel nome={projeto.icone ?? 'clipboard-note'} tamanho={20} cor={cor} />
            </MolduraPixel>
            <View style={styles.textosBotao}>
              <Text style={styles.tituloBotao} numberOfLines={1}>
                {titulo}
              </Text>
              <Text style={styles.detalheBotao} numberOfLines={1}>
                {detalhe}
              </Text>
            </View>
            <IconePixel nome="chevron-right-2" tamanho={26} cor={cores.preto} />
          </View>
        </MolduraPixel>
      </Pressionavel>
    </View>
  );
}

// Janela com o que fazer hoje: tempo de dedicação e tarefas para ir marcando.
export function JanelaHoje({ projeto, visivel, aoFechar, aoFocar }) {
  const { alternarTarefa } = useHabitos();
  if (!projeto) {
    return null;
  }
  const { hoje, proxima } = sessaoDoDia(projeto);
  const sessao = hoje ?? proxima;
  const cor = projeto.cor ?? cores.turquesa;
  const feitas = sessao?.tarefasFeitas ?? [];
  const tarefas = sessao?.tarefas ?? [];

  return (
    <Modal visible={visivel} transparent animationType="fade" onRequestClose={aoFechar}>
      <Pressable style={styles.fundo} onPress={aoFechar} accessibilityLabel="Fechar">
        <Pressable style={styles.janela} onPress={() => {}}>
          <Entrada tipo="escala" mola="quique">
            <MolduraPixel corFundo={cores.cartao} corTopo={cor} pixel={5}>
              <View style={styles.interno}>
                <View style={styles.linha}>
                  <IconePixel nome={projeto.icone ?? 'clipboard-note'} tamanho={22} cor={cor} />
                  <Text style={styles.nomeProjeto} numberOfLines={1}>
                    {projeto.nome}
                  </Text>
                  <Pressionavel aoPressionar={aoFechar} escala={0.8} accessibilityLabel="Fechar">
                    <IconePixel nome="close" tamanho={22} cor={cores.cinzaClaro} />
                  </Pressionavel>
                </View>

                {sessao ? (
                  <>
                    <Text style={styles.rotulo}>
                      {hoje ? 'Hoje' : `Hoje é dia livre · próximo: ${rotuloData(sessao.data)}`}
                    </Text>
                    <Text style={[styles.tempo, { color: cor }]}>
                      {`Dedique ${formatarDuracao(sessao.minutos)}`}
                    </Text>
                    <Text style={styles.tituloSessao}>{sessao.titulo}</Text>

                    {tarefas.length > 0 ? (
                      <>
                        <View style={styles.progresso}>
                          <BarraProgresso feitos={feitas.length} total={tarefas.length} cor={cor} />
                        </View>
                        {tarefas.map((tarefa, indice) => {
                          const feita = feitas.includes(indice);
                          return (
                            <Pressionavel
                              key={tarefa}
                              aoPressionar={() => alternarTarefa(projeto.id, sessao.id, indice)}
                              escala={0.96}
                              vibracaoSoltar={feita ? 'soltar' : 'sucesso'}
                              som={feita ? 'desmarcar' : 'marcar'}
                              accessibilityRole="checkbox"
                              accessibilityState={{ checked: feita }}
                            >
                              <View style={styles.tarefa}>
                                <MolduraPixel
                                  corFundo={feita ? cores.sucesso : cores.trilha}
                                  pixel={3}
                                  degraus={1}
                                  style={styles.caixa}
                                >
                                  {feita ? (
                                    <IconePixel nome="check" tamanho={18} cor={cores.fundo} />
                                  ) : null}
                                </MolduraPixel>
                                <Text style={[styles.textoTarefa, feita && styles.riscada]}>
                                  {tarefa}
                                </Text>
                              </View>
                            </Pressionavel>
                          );
                        })}
                      </>
                    ) : null}

                    {!sessao.feita ? (
                      <Botao
                        texto={hoje ? 'Começar foco' : 'Adiantar e focar agora'}
                        aoPressionar={() => aoFocar(sessao)}
                      />
                    ) : (
                      <Text style={styles.feito}>Sessão concluída. Mandou bem!</Text>
                    )}
                  </>
                ) : (
                  <Text style={styles.rotulo}>Todas as sessões deste projeto já passaram.</Text>
                )}
              </View>
            </MolduraPixel>
          </Entrada>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  botao: {
    marginTop: 10,
    paddingBottom: ALTURA_BASE,
  },
  base: {
    position: 'absolute',
    top: ALTURA_BASE,
    bottom: 0,
    left: 0,
    right: 0,
  },
  conteudoBotao: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  icone: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textosBotao: {
    flex: 1,
    marginHorizontal: 10,
  },
  tituloBotao: {
    color: cores.preto,
    fontFamily: fontes.negrito,
    fontVariant: fontes.semLigaduras,
    fontSize: 16,
  },
  detalheBotao: {
    color: cores.preto,
    fontFamily: fontes.media,
    fontVariant: fontes.semLigaduras,
    fontSize: 12,
    opacity: 0.75,
  },
  fundo: {
    flex: 1,
    backgroundColor: 'rgba(14, 13, 21, 0.82)',
    justifyContent: 'center',
    padding: 20,
  },
  janela: {
    width: '100%',
  },
  interno: {
    padding: 16,
    paddingTop: 20,
  },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  nomeProjeto: {
    flex: 1,
    color: cores.branco,
    fontFamily: fontes.negrito,
    fontVariant: fontes.semLigaduras,
    fontSize: 18,
  },
  rotulo: {
    color: cores.cinzaClaro,
    fontFamily: fontes.media,
    fontVariant: fontes.semLigaduras,
    fontSize: 13,
    marginTop: 14,
  },
  tempo: {
    fontFamily: fontes.negrito,
    fontVariant: fontes.semLigaduras,
    fontSize: 30,
    marginTop: 2,
  },
  tituloSessao: {
    color: cores.branco,
    fontFamily: fontes.media,
    fontVariant: fontes.semLigaduras,
    fontSize: 16,
    marginTop: 4,
  },
  progresso: {
    marginTop: 12,
    marginBottom: 4,
  },
  tarefa: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
  },
  caixa: {
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoTarefa: {
    flex: 1,
    color: cores.branco,
    fontFamily: fontes.regular,
    fontVariant: fontes.semLigaduras,
    fontSize: 15,
    marginLeft: 12,
  },
  riscada: {
    color: cores.cinza,
    textDecorationLine: 'line-through',
  },
  feito: {
    color: cores.sucesso,
    fontFamily: fontes.negrito,
    fontVariant: fontes.semLigaduras,
    fontSize: 15,
    textAlign: 'center',
    marginTop: 14,
  },
});
