import { useCallback, useEffect, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  Alert,
  KeyboardAvoidingView,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import MascoteRevi from './MascoteRevi';
import MolduraPixel from './MolduraPixel';
import IconePixel from './IconePixel';
import CampoTexto from './CampoTexto';
import Botao from './Botao';
import LinkTexto from './LinkTexto';
import Pressionavel from './Pressionavel';
import Entrada from './Entrada';
import { useHabitos } from '../contexto/HabitosContexto';
import { siglasDias } from '../data/opcoes';
import { cores, fontes } from '../styles/tema';
import { rotuloData } from '../utils/datas';
import {
  ChaveInvalida,
  LimiteAtingido,
  LINK_CHAVE,
  SemConexao,
  chaveDoAmbiente,
  lerJson,
  perguntarGemini,
} from '../utils/gemini';
import { formatarDuracao, validarHabitos, validarOpcoes, validarProjeto } from '../utils/reviIA';
import { tocar } from '../utils/sons';
import { sucesso } from '../utils/tato';

const descreverDias = (frequencia) =>
  frequencia.length === 7 ? 'todo dia' : frequencia.map((dia) => siglasDias[dia]).join(', ');

const descreverHabito = ({ frequencia, lembrete, repetir }) =>
  `${descreverDias(frequencia)}${lembrete ? ` · ${lembrete}` : ''}${
    repetir ? ` · a cada ${repetir}h` : ''
  }`;

function CartaoChave({ aoConectar }) {
  const [chave, setChave] = useState('');

  return (
    <MolduraPixel corFundo={cores.cartaoDestaque} pixel={4} style={styles.cartaoChave}>
      <View style={styles.internoCartao}>
        <View style={styles.linhaTitulo}>
          <IconePixel nome="key" tamanho={22} cor={cores.amarelo} />
          <Text style={styles.tituloCartao}>Conectar o Revi à IA</Text>
        </View>
        <Text style={styles.textoCartao}>
          O Revi usa o Gemini, do Google, que é grátis. Crie sua chave no Google AI Studio e cole
          aqui. Ela fica salva só neste celular.
        </Text>
        <LinkTexto
          texto="Pegar minha chave grátis"
          aoPressionar={() => Linking.openURL(LINK_CHAVE)}
        />
        <CampoTexto
          icone="key"
          placeholder="Cole a chave aqui"
          value={chave}
          onChangeText={setChave}
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry
        />
        <Botao texto="Conectar" aoPressionar={() => chave.trim() && aoConectar(chave)} />
      </View>
    </MolduraPixel>
  );
}

function Pensando() {
  const [quadro, setQuadro] = useState(0);

  // Pontinhos que andam enquanto o Revi pensa.
  useEffect(() => {
    const relogio = setInterval(() => setQuadro((atual) => (atual + 1) % 4), 280);
    return () => clearInterval(relogio);
  }, []);

  return (
    <View style={styles.pensando}>
      {[0, 1, 2].map((ponto) => (
        <View key={ponto} style={[styles.ponto, { opacity: ponto < quadro ? 1 : 0.25 }]} />
      ))}
    </View>
  );
}

// Respostas rápidas, coladas embaixo do balão do Revi.
function Opcoes({ opcoes, aoEscolher, desligado }) {
  return (
    <View style={styles.opcoes}>
      {opcoes.map((opcao) => (
        <Pressionavel
          key={opcao}
          aoPressionar={() => aoEscolher(opcao)}
          disabled={desligado}
          escala={0.9}
          som="navegar"
        >
          <MolduraPixel
            corFundo={cores.cartaoDestaque}
            corTopo={cores.amarelo}
            pixel={2}
            degraus={1}
          >
            <Text style={styles.textoOpcao}>{opcao}</Text>
          </MolduraPixel>
        </Pressionavel>
      ))}
    </View>
  );
}

// Prévia do plano: o que fazer em cada dia, antes de criar o projeto.
function CartaoPlano({ plano, criadoId, aoCriar, aoVer }) {
  const [aberto, setAberto] = useState(false);
  const visiveis = aberto ? plano.sessoes : plano.sessoes.slice(0, 3);

  return (
    <MolduraPixel
      corFundo={cores.cartaoDestaque}
      corTopo={cores.turquesa}
      pixel={3}
      style={styles.criado}
    >
      <View style={styles.internoCartao}>
        <View style={styles.linhaTitulo}>
          <IconePixel nome={plano.icone} tamanho={20} cor={cores.turquesa} />
          <Text style={styles.tituloCriado} numberOfLines={1}>
            {plano.nome}
          </Text>
        </View>
        <Text style={styles.detalheItem}>
          {`${plano.sessoes.length} dias de foco · até ${rotuloData(plano.prazo)} · ${plano.horario}`}
        </Text>

        {visiveis.map((sessao) => (
          <View key={sessao.id} style={styles.diaPlano}>
            <View style={styles.cabecalhoDia}>
              <Text style={styles.dataDia}>{rotuloData(sessao.data)}</Text>
              <Text style={styles.tituloDia} numberOfLines={1}>
                {sessao.titulo}
              </Text>
              <Text style={styles.duracaoDia}>{formatarDuracao(sessao.minutos)}</Text>
            </View>
            {sessao.tarefas.map((tarefa) => (
              <Text key={tarefa} style={styles.tarefa} numberOfLines={2}>
                {`▪ ${tarefa}`}
              </Text>
            ))}
          </View>
        ))}
        {plano.sessoes.length > 3 ? (
          <View style={styles.esquerda}>
            <LinkTexto
              texto={aberto ? 'Mostrar menos' : `Ver os ${plano.sessoes.length} dias`}
              aoPressionar={() => setAberto((atual) => !atual)}
            />
          </View>
        ) : null}

        <View style={styles.acaoPlano}>
          {criadoId ? (
            <Botao texto="Ver projeto criado" variante="claro" aoPressionar={aoVer} />
          ) : (
            <Botao texto="Criar projeto" aoPressionar={aoCriar} />
          )}
        </View>
      </View>
    </MolduraPixel>
  );
}

// O que o Revi criou sozinho no app, com atalho para ver e para desfazer.
function CartaoCriado({ criado, desfeito, aoVerProjeto, aoDesfazer }) {
  return (
    <MolduraPixel
      corFundo={cores.cartaoDestaque}
      corTopo={desfeito ? cores.cinza : cores.sucesso}
      pixel={3}
      style={styles.criado}
    >
      <View style={styles.internoCartao}>
        <View style={styles.linhaTitulo}>
          <IconePixel
            nome={desfeito ? 'reload' : 'check'}
            tamanho={20}
            cor={desfeito ? cores.cinza : cores.sucesso}
          />
          <Text style={styles.tituloCriado}>{desfeito ? 'Desfeito' : 'Criei no app pra você'}</Text>
        </View>

        {criado.projeto ? (
          <View style={styles.itemCriado}>
            <IconePixel nome="clipboard-note" tamanho={20} cor={cores.turquesa} />
            <View style={styles.textosItem}>
              <Text style={styles.nomeItem} numberOfLines={1}>
                {criado.projeto.nome}
              </Text>
              <Text style={styles.detalheItem}>
                {`${criado.projeto.sessoes} dias até ${rotuloData(criado.projeto.ultima)} · ${
                  criado.projeto.horario
                }`}
              </Text>
            </View>
            {!desfeito ? <LinkTexto texto="Ver" aoPressionar={aoVerProjeto} /> : null}
          </View>
        ) : null}

        {criado.habitos.map((habito) => (
          <View key={habito.id} style={styles.itemCriado}>
            <IconePixel nome={habito.icone} tamanho={20} cor={cores.branco} />
            <View style={styles.textosItem}>
              <Text style={styles.nomeItem} numberOfLines={1}>
                {habito.nome}
              </Text>
              <Text style={styles.detalheItem}>{descreverHabito(habito)}</Text>
            </View>
          </View>
        ))}

        {!desfeito ? (
          <View style={styles.rodapeCriado}>
            <View style={styles.linhaTitulo}>
              <IconePixel nome="bell" tamanho={16} cor={cores.amarelo} />
              <Text style={styles.textoNotificacao}>Lembretes agendados</Text>
            </View>
            <LinkTexto texto="Desfazer" aoPressionar={aoDesfazer} />
          </View>
        ) : null}
      </View>
    </MolduraPixel>
  );
}

// Chat com o Revi. O mesmo componente serve para a rotina (aba Revi) e para projetos:
// muda o canal (cada um com sua conversa salva), as instruções da IA e os atalhos.
export default function ChatRevi({
  canal,
  navigation,
  instrucoes,
  saudacao,
  atalhos,
  mostrarCabecalho = false,
}) {
  const {
    habitos,
    projetos,
    revi,
    usuario,
    config,
    conversas,
    adicionarMensagem,
    atualizarMensagem,
    adicionarHabito,
    excluirHabito,
    adicionarProjeto,
    excluirProjeto,
    marcarSugestaoAdicionada,
    limparConversa,
    avisarLimite,
    definirChaveGemini,
    arquivo,
    arquivarConversa,
  } = useHabitos();
  const [texto, setTexto] = useState('');
  const [pensando, setPensando] = useState(false);
  const rolagem = useRef(null);

  const conversa = conversas[canal] ?? [];
  const chave = config.chaveGemini || chaveDoAmbiente;
  const antigas = (arquivo[canal] ?? []).length;
  // Muda quando a conversa vai para o histórico: respostas que chegarem depois são ignoradas.
  const geracao = useRef(0);

  // Ao sair da tela, a conversa vai para o histórico e a próxima começa limpa.
  useFocusEffect(
    useCallback(
      () => () => {
        geracao.current += 1;
        arquivarConversa(canal);
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [canal],
    ),
  );

  const abrirHistorico = () => navigation.navigate('HistoricoChat', { canal });

  useEffect(() => {
    const tempo = setTimeout(() => rolagem.current?.scrollToEnd({ animated: true }), 80);
    return () => clearTimeout(tempo);
  }, [conversa.length, pensando]);

  const criarProjeto = (projeto, resumo) => ({
    id: adicionarProjeto({ ...projeto, resumo }),
    nome: projeto.nome,
    sessoes: projeto.sessoes.length,
    ultima: projeto.sessoes[projeto.sessoes.length - 1].data,
    horario: projeto.horario,
  });

  // Executa o que a IA decidiu criar e devolve o resumo para o cartão da conversa.
  const executarAcoes = (acoes, resumo) => {
    const novos = validarHabitos(acoes?.habitos, habitos);
    const projeto = validarProjeto(acoes?.projeto, habitos);
    if (novos.length === 0 && !projeto) {
      return { criado: null, novos };
    }
    return {
      novos,
      criado: {
        habitos: novos.map((habito) => ({ ...habito, id: adicionarHabito(habito) })),
        projeto: projeto ? criarProjeto(projeto, resumo) : null,
      },
    };
  };

  const enviar = async (mensagem) => {
    const limpa = mensagem.trim();
    if (!limpa || pensando || !chave) {
      return;
    }
    setTexto('');
    adicionarMensagem(canal, { papel: 'pessoa', texto: limpa });
    setPensando(true);
    const minhaGeracao = geracao.current;

    try {
      // O Revi precisa lembrar o que já propôs e criou para poder ajustar depois.
      const historico = [...conversa, { papel: 'pessoa', texto: limpa }]
        .filter(({ tipo }) => !tipo)
        .slice(-16)
        .map(({ papel, texto: fala, criado, desfeito, plano }) => {
          const extras = [];
          if (plano) {
            extras.push(
              `Plano proposto: ${JSON.stringify({
                ...plano,
                sessoes: plano.sessoes.map(({ data, titulo, minutos, tarefas }) => ({
                  data,
                  titulo,
                  minutos,
                  tarefas,
                })),
              })}`,
            );
          }
          if (criado && !desfeito) {
            extras.push(
              `Criado no app: ${[
                criado.projeto ? `projeto ${criado.projeto.nome}` : '',
                ...criado.habitos.map(({ nome, lembrete }) => `hábito ${nome} ${lembrete}`),
              ]
                .filter(Boolean)
                .join(', ')}`,
            );
          }
          return { papel, texto: [fala, ...extras].join('\n') };
        });

      const resposta = await perguntarGemini({
        chave,
        instrucoes: instrucoes({
          nomeRevi: revi.nome,
          nomeUsuario: usuario.nome,
          habitos,
          projetos,
        }),
        mensagens: historico,
      });
      if (geracao.current !== minhaGeracao) {
        return;
      }
      const dados = lerJson(resposta);
      const fala = dados?.resposta ?? 'Hmm, me perdi aqui. Pode falar de novo?';
      const { criado, novos } = executarAcoes(dados?.acoes, fala);
      const plano = criado?.projeto ? null : validarProjeto(dados?.plano, habitos);

      adicionarMensagem(canal, {
        papel: 'revi',
        texto: fala,
        habitos: validarHabitos(dados?.habitos, [...habitos, ...novos]),
        opcoes: validarOpcoes(dados?.opcoes),
        plano,
        criado,
      });
      if (criado) {
        sucesso();
        tocar('conquista');
      } else {
        tocar('reviFeliz');
      }
    } catch (erro) {
      if (geracao.current !== minhaGeracao) {
        return;
      }
      tocar('erro');
      if (erro instanceof LimiteAtingido) {
        avisarLimite(canal);
      } else if (erro instanceof ChaveInvalida) {
        adicionarMensagem(canal, {
          papel: 'revi',
          tipo: 'erro',
          texto:
            'Essa chave do Gemini não funcionou. Confere se copiou certinho e conecta de novo.',
        });
        definirChaveGemini('');
      } else if (erro instanceof SemConexao) {
        adicionarMensagem(canal, {
          papel: 'revi',
          tipo: 'erro',
          texto: 'Tô sem internet agora. Confere a conexão e tenta de novo!',
        });
      } else {
        adicionarMensagem(canal, {
          papel: 'revi',
          tipo: 'erro',
          texto: `Deu ruim: ${erro.message}`,
        });
      }
    } finally {
      setPensando(false);
    }
  };

  const adicionarSugestao = (mensagem, habito, indice) => {
    adicionarHabito(habito);
    marcarSugestaoAdicionada(canal, mensagem.id, indice);
  };

  const criarDoPlano = (mensagem) => {
    const criado = criarProjeto(mensagem.plano, mensagem.texto);
    atualizarMensagem(canal, mensagem.id, { planoCriado: criado.id });
    sucesso();
    tocar('conquista');
  };

  const desfazer = (mensagem) => {
    mensagem.criado.habitos.forEach(({ id }) => excluirHabito(id));
    if (mensagem.criado.projeto) {
      excluirProjeto(mensagem.criado.projeto.id);
    }
    atualizarMensagem(canal, mensagem.id, { desfeito: true });
    tocar('desmarcar');
  };

  const limpar = () =>
    Alert.alert('Limpar conversa', 'Apagar as mensagens desta conversa com o Revi?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Limpar', style: 'destructive', onPress: () => limparConversa(canal) },
    ]);

  const verProjeto = (id) => {
    if (projetos.some((projeto) => projeto.id === id)) {
      navigation.navigate('ProjetoDetalhe', { id });
    }
  };

  const mensagens = [{ id: 'oi', papel: 'revi', texto: saudacao, opcoes: atalhos }, ...conversa];
  const ultimaDoRevi = [...mensagens].reverse().find(({ papel }) => papel === 'revi');

  return (
    <>
      {mostrarCabecalho ? (
        <>
          <View style={styles.cabecalho}>
            <MascoteRevi humor={pensando ? 'neutro' : 'feliz'} aparencia={revi} bloco={3} />
            <View style={styles.textosCabecalho}>
              <Text style={styles.nome}>{revi.nome}</Text>
              <Text style={[styles.status, pensando && styles.statusPensando]}>
                {pensando ? 'pensando…' : chave ? 'online · IA' : 'desconectado'}
              </Text>
            </View>
            <Pressionavel
              aoPressionar={abrirHistorico}
              escala={0.85}
              style={styles.botaoTopo}
              accessibilityLabel="Histórico de conversas"
            >
              <IconePixel nome="archive" tamanho={24} cor={cores.cinzaClaro} />
              {antigas > 0 ? <Text style={styles.contagemTopo}>{antigas}</Text> : null}
            </Pressionavel>
            {conversa.length > 0 ? (
              <Pressionavel
                aoPressionar={limpar}
                escala={0.85}
                accessibilityLabel="Limpar conversa"
              >
                <IconePixel nome="trash" tamanho={24} cor={cores.cinzaClaro} />
              </Pressionavel>
            ) : null}
          </View>
          <View style={styles.faixa} />
        </>
      ) : null}

      <KeyboardAvoidingView
        style={styles.corpo}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          ref={rolagem}
          style={styles.lista}
          contentContainerStyle={styles.mensagens}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {!mostrarCabecalho && antigas > 0 ? (
            <View style={styles.linhaHistorico}>
              <LinkTexto
                texto={`Histórico de conversas (${antigas})`}
                tamanho={14}
                aoPressionar={abrirHistorico}
              />
            </View>
          ) : null}
          {!chave ? <CartaoChave aoConectar={definirChaveGemini} /> : null}

          {mensagens.map((mensagem, posicao) => {
            const daPessoa = mensagem.papel === 'pessoa';
            const aviso = mensagem.tipo === 'limite' || mensagem.tipo === 'erro';
            const adicionadas = mensagem.adicionadas ?? [];
            const sugestoes = mensagem.habitos ?? [];
            const mostrarOpcoes =
              mensagem === ultimaDoRevi && !pensando && (mensagem.opcoes ?? []).length > 0;

            return (
              <Entrada
                key={mensagem.id}
                tipo={daPessoa ? 'direita' : 'esquerda'}
                ordem={posicao === 0 ? 1 : 0}
                style={daPessoa ? styles.blocoPessoa : styles.blocoRevi}
              >
                <MolduraPixel
                  corFundo={daPessoa ? cores.turquesa : aviso ? cores.cartaoDestaque : cores.creme}
                  corTopo={aviso ? cores.amarelo : undefined}
                  pixel={3}
                >
                  {aviso ? (
                    <View style={styles.linhaAviso}>
                      <IconePixel nome="zap" tamanho={16} cor={cores.amarelo} />
                      <Text style={styles.rotuloAviso}>
                        {mensagem.tipo === 'limite' ? 'Limite do Gemini' : 'Ops'}
                      </Text>
                    </View>
                  ) : null}
                  <Text style={[styles.textoBolha, aviso && styles.textoAviso]}>
                    {mensagem.texto}
                  </Text>
                </MolduraPixel>

                {mensagem.plano ? (
                  <CartaoPlano
                    plano={mensagem.plano}
                    criadoId={mensagem.planoCriado}
                    aoCriar={() => criarDoPlano(mensagem)}
                    aoVer={() => verProjeto(mensagem.planoCriado)}
                  />
                ) : null}

                {mensagem.criado ? (
                  <CartaoCriado
                    criado={mensagem.criado}
                    desfeito={mensagem.desfeito}
                    aoVerProjeto={() => verProjeto(mensagem.criado.projeto.id)}
                    aoDesfazer={() => desfazer(mensagem)}
                  />
                ) : null}

                {sugestoes.map((habito, indice) => {
                  const feita = adicionadas.includes(indice);
                  return (
                    <MolduraPixel
                      key={`${mensagem.id}-${habito.nome}`}
                      corFundo={cores.cartao}
                      pixel={3}
                      style={styles.sugestao}
                    >
                      <View style={styles.linhaSugestao}>
                        <IconePixel nome={habito.icone} tamanho={22} cor={cores.branco} />
                        <View style={styles.textosItem}>
                          <Text style={styles.nomeItem} numberOfLines={1}>
                            {habito.nome}
                          </Text>
                          <Text style={styles.detalheItem} numberOfLines={1}>
                            {descreverHabito(habito)}
                          </Text>
                        </View>
                        <Pressionavel
                          aoPressionar={() => adicionarSugestao(mensagem, habito, indice)}
                          disabled={feita}
                          escala={0.85}
                          som={feita ? null : 'marcar'}
                          vibracaoSoltar="sucesso"
                        >
                          <MolduraPixel
                            corFundo={feita ? cores.trilha : cores.principal}
                            pixel={2}
                            degraus={1}
                          >
                            <Text style={[styles.textoBotao, feita && styles.textoFeito]}>
                              {feita ? 'Adicionado' : 'Adicionar'}
                            </Text>
                          </MolduraPixel>
                        </Pressionavel>
                      </View>
                    </MolduraPixel>
                  );
                })}
                {sugestoes.length > 1 && adicionadas.length < sugestoes.length ? (
                  <View style={styles.esquerda}>
                    <LinkTexto
                      texto="Adicionar todos"
                      aoPressionar={() =>
                        sugestoes.forEach((habito, indice) => {
                          if (!adicionadas.includes(indice)) {
                            adicionarSugestao(mensagem, habito, indice);
                          }
                        })
                      }
                    />
                  </View>
                ) : null}

                {mostrarOpcoes ? (
                  <Opcoes opcoes={mensagem.opcoes} aoEscolher={enviar} desligado={!chave} />
                ) : null}
              </Entrada>
            );
          })}

          {pensando ? <Pensando /> : null}
        </ScrollView>

        <View style={styles.entrada}>
          <MolduraPixel corFundo={cores.branco} corTopo={cores.cinzaClaro} style={styles.campo}>
            <TextInput
              style={styles.input}
              value={texto}
              onChangeText={setTexto}
              placeholder={chave ? `Fale com o ${revi.nome}…` : 'Conecte a IA acima'}
              placeholderTextColor={cores.placeholder}
              selectionColor={cores.petroleo}
              editable={Boolean(chave)}
              multiline
              maxLength={400}
            />
          </MolduraPixel>
          <Pressionavel
            aoPressionar={() => enviar(texto)}
            disabled={!chave || pensando || !texto.trim()}
            escala={0.85}
            vibracaoApertar="apertar"
            accessibilityLabel="Enviar"
          >
            <MolduraPixel
              corFundo={texto.trim() && chave ? cores.principal : cores.trilha}
              pixel={3}
              degraus={1}
              style={styles.enviar}
            >
              <IconePixel nome="send" tamanho={24} cor={cores.preto} />
            </MolduraPixel>
          </Pressionavel>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 10,
  },
  textosCabecalho: {
    flex: 1,
    marginLeft: 12,
  },
  nome: {
    color: cores.branco,
    fontFamily: fontes.negrito,
    fontVariant: fontes.semLigaduras,
    fontSize: 24,
  },
  status: {
    color: cores.turquesa,
    fontFamily: fontes.media,
    fontVariant: fontes.semLigaduras,
    fontSize: 13,
  },
  statusPensando: {
    color: cores.amarelo,
  },
  faixa: {
    height: 2,
    marginHorizontal: 20,
    backgroundColor: cores.trilha,
  },
  botaoTopo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 14,
  },
  contagemTopo: {
    color: cores.cinzaClaro,
    fontFamily: fontes.negrito,
    fontVariant: fontes.semLigaduras,
    fontSize: 12,
    marginLeft: 3,
  },
  linhaHistorico: {
    alignItems: 'flex-end',
    marginTop: -6,
    marginBottom: 6,
  },
  corpo: {
    flex: 1,
  },
  // A lista ocupa todo o espaço livre; assim nada fica "flutuando" no meio da tela.
  lista: {
    flex: 1,
  },
  mensagens: {
    padding: 16,
    paddingBottom: 8,
  },
  blocoRevi: {
    alignSelf: 'flex-start',
    maxWidth: '90%',
    marginBottom: 12,
  },
  blocoPessoa: {
    alignSelf: 'flex-end',
    maxWidth: '82%',
    marginBottom: 12,
  },
  textoBolha: {
    color: cores.preto,
    fontFamily: fontes.media,
    fontVariant: fontes.semLigaduras,
    fontSize: 15,
    lineHeight: 21,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  textoAviso: {
    color: cores.branco,
    paddingTop: 2,
  },
  linhaAviso: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingTop: 10,
  },
  rotuloAviso: {
    color: cores.amarelo,
    fontFamily: fontes.negrito,
    fontVariant: fontes.semLigaduras,
    fontSize: 13,
  },
  opcoes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 6,
  },
  textoOpcao: {
    color: cores.creme,
    fontFamily: fontes.media,
    fontVariant: fontes.semLigaduras,
    fontSize: 13,
    paddingHorizontal: 10,
    paddingTop: 8,
    paddingBottom: 6,
  },
  sugestao: {
    marginTop: 6,
  },
  linhaSugestao: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  textosItem: {
    flex: 1,
    marginHorizontal: 10,
  },
  nomeItem: {
    color: cores.branco,
    fontFamily: fontes.negrito,
    fontVariant: fontes.semLigaduras,
    fontSize: 15,
  },
  detalheItem: {
    color: cores.cinzaClaro,
    fontFamily: fontes.regular,
    fontVariant: fontes.semLigaduras,
    fontSize: 12,
  },
  textoBotao: {
    color: cores.preto,
    fontFamily: fontes.negrito,
    fontVariant: fontes.semLigaduras,
    fontSize: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  textoFeito: {
    color: cores.cinzaClaro,
  },
  esquerda: {
    alignItems: 'flex-start',
  },
  criado: {
    marginTop: 6,
  },
  tituloCriado: {
    flex: 1,
    color: cores.branco,
    fontFamily: fontes.negrito,
    fontVariant: fontes.semLigaduras,
    fontSize: 15,
  },
  itemCriado: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  rodapeCriado: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  textoNotificacao: {
    color: cores.amarelo,
    fontFamily: fontes.media,
    fontVariant: fontes.semLigaduras,
    fontSize: 12,
  },
  diaPlano: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 2,
    borderTopColor: cores.trilha,
  },
  cabecalhoDia: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  dataDia: {
    width: 64,
    color: cores.turquesa,
    fontFamily: fontes.negrito,
    fontVariant: fontes.semLigaduras,
    fontSize: 12,
  },
  tituloDia: {
    flex: 1,
    color: cores.branco,
    fontFamily: fontes.media,
    fontVariant: fontes.semLigaduras,
    fontSize: 13,
  },
  duracaoDia: {
    color: cores.amarelo,
    fontFamily: fontes.negrito,
    fontVariant: fontes.semLigaduras,
    fontSize: 12,
    marginLeft: 6,
  },
  tarefa: {
    color: cores.cinzaClaro,
    fontFamily: fontes.regular,
    fontVariant: fontes.semLigaduras,
    fontSize: 12,
    lineHeight: 17,
    marginLeft: 64,
  },
  acaoPlano: {
    marginTop: 6,
  },
  pensando: {
    flexDirection: 'row',
    gap: 6,
    paddingLeft: 8,
    paddingVertical: 8,
  },
  ponto: {
    width: 8,
    height: 8,
    backgroundColor: cores.creme,
  },
  entrada: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 10,
    paddingTop: 6,
    gap: 8,
  },
  campo: {
    flex: 1,
  },
  input: {
    minHeight: 46,
    maxHeight: 110,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 10,
    fontFamily: fontes.regular,
    fontVariant: fontes.semLigaduras,
    fontSize: 16,
    color: cores.preto,
  },
  enviar: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartaoChave: {
    marginBottom: 16,
  },
  internoCartao: {
    padding: 12,
    paddingTop: 14,
  },
  linhaTitulo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tituloCartao: {
    color: cores.branco,
    fontFamily: fontes.negrito,
    fontVariant: fontes.semLigaduras,
    fontSize: 18,
  },
  textoCartao: {
    color: cores.cinzaClaro,
    fontFamily: fontes.regular,
    fontVariant: fontes.semLigaduras,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
  },
});
