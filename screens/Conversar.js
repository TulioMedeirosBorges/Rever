import { useEffect, useRef, useState } from 'react';
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
import Tela from '../components/Tela';
import MascoteRevi from '../components/MascoteRevi';
import MolduraPixel from '../components/MolduraPixel';
import IconePixel from '../components/IconePixel';
import CampoTexto from '../components/CampoTexto';
import Botao from '../components/Botao';
import LinkTexto from '../components/LinkTexto';
import Pressionavel from '../components/Pressionavel';
import Entrada from '../components/Entrada';
import BarraInferior from '../components/BarraInferior';
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
import { instrucoesConversa, validarHabitos, validarOpcoes, validarProjeto } from '../utils/reviIA';
import { tocar } from '../utils/sons';
import { sucesso } from '../utils/tato';

const atalhos = ['Quero dormir às 23h', 'Rotina de estudo até a prova', 'Quero beber mais água'];

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
                {`${criado.projeto.sessoes} sessões até ${rotuloData(criado.projeto.ultima)} · ${
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

export default function Conversar({ navigation }) {
  const {
    habitos,
    projetos,
    revi,
    usuario,
    config,
    conversa,
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
  } = useHabitos();
  const [texto, setTexto] = useState('');
  const [pensando, setPensando] = useState(false);
  const rolagem = useRef(null);

  const chave = config.chaveGemini || chaveDoAmbiente;

  useEffect(() => {
    const tempo = setTimeout(() => rolagem.current?.scrollToEnd({ animated: true }), 80);
    return () => clearTimeout(tempo);
  }, [conversa.length, pensando]);

  // Executa o que a IA decidiu criar e devolve o resumo para o cartão da conversa.
  const executarAcoes = (acoes, resumo) => {
    const novos = validarHabitos(acoes?.habitos, habitos);
    const projeto = validarProjeto(acoes?.projeto, habitos);
    if (novos.length === 0 && !projeto) {
      return { criado: null, novos };
    }
    const criado = {
      habitos: novos.map((habito) => ({ ...habito, id: adicionarHabito(habito) })),
      projeto: null,
    };
    if (projeto) {
      criado.projeto = {
        id: adicionarProjeto({ ...projeto, resumo }),
        nome: projeto.nome,
        sessoes: projeto.sessoes.length,
        ultima: projeto.sessoes[projeto.sessoes.length - 1].data,
        horario: projeto.horario,
      };
    }
    return { criado, novos };
  };

  const enviar = async (mensagem) => {
    const limpa = mensagem.trim();
    if (!limpa || pensando || !chave) {
      return;
    }
    setTexto('');
    adicionarMensagem({ papel: 'pessoa', texto: limpa });
    setPensando(true);

    try {
      // O Revi precisa lembrar o que já criou para poder ajustar depois ("muda pra 20h").
      const historico = [...conversa, { papel: 'pessoa', texto: limpa }]
        .filter(({ tipo }) => !tipo)
        .slice(-16)
        .map(({ papel, texto: fala, criado, desfeito }) => ({
          papel,
          texto:
            criado && !desfeito
              ? `${fala}
(Criado no app: ${[
                  criado.projeto ? `projeto ${criado.projeto.nome}` : '',
                  ...criado.habitos.map(({ nome, lembrete }) => `hábito ${nome} ${lembrete}`),
                ]
                  .filter(Boolean)
                  .join(', ')})`
              : fala,
        }));
      const resposta = await perguntarGemini({
        chave,
        instrucoes: instrucoesConversa({
          nomeRevi: revi.nome,
          nomeUsuario: usuario.nome,
          habitos,
          projetos,
        }),
        mensagens: historico,
      });
      const dados = lerJson(resposta);
      const fala = dados?.resposta ?? 'Hmm, me perdi aqui. Pode falar de novo?';
      const { criado, novos } = executarAcoes(dados?.acoes, fala);

      adicionarMensagem({
        papel: 'revi',
        texto: fala,
        habitos: validarHabitos(dados?.habitos, [...habitos, ...novos]),
        opcoes: validarOpcoes(dados?.opcoes),
        criado,
      });
      if (criado) {
        sucesso();
        tocar('conquista');
      } else {
        tocar('reviFeliz');
      }
    } catch (erro) {
      tocar('erro');
      if (erro instanceof LimiteAtingido) {
        avisarLimite();
      } else if (erro instanceof ChaveInvalida) {
        adicionarMensagem({
          papel: 'revi',
          tipo: 'erro',
          texto:
            'Essa chave do Gemini não funcionou. Confere se copiou certinho e conecta de novo.',
        });
        definirChaveGemini('');
      } else if (erro instanceof SemConexao) {
        adicionarMensagem({
          papel: 'revi',
          tipo: 'erro',
          texto: 'Tô sem internet agora. Confere a conexão e tenta de novo!',
        });
      } else {
        adicionarMensagem({ papel: 'revi', tipo: 'erro', texto: `Deu ruim: ${erro.message}` });
      }
    } finally {
      setPensando(false);
    }
  };

  const adicionarSugestao = (mensagem, habito, indice) => {
    adicionarHabito(habito);
    marcarSugestaoAdicionada(mensagem.id, indice);
  };

  const desfazer = (mensagem) => {
    mensagem.criado.habitos.forEach(({ id }) => excluirHabito(id));
    if (mensagem.criado.projeto) {
      excluirProjeto(mensagem.criado.projeto.id);
    }
    atualizarMensagem(mensagem.id, { desfeito: true });
    tocar('desmarcar');
  };

  const limpar = () =>
    Alert.alert('Limpar conversa', 'Apagar todas as mensagens com o Revi?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Limpar', style: 'destructive', onPress: limparConversa },
    ]);

  const saudacao = {
    id: 'oi',
    papel: 'revi',
    texto: `Oi, ${usuario.nome}! Me fala o que você quer: eu sugiro hábitos e, se você pedir, já crio tudo no app com lembretes.`,
    opcoes: atalhos,
  };
  const mensagens = [saudacao, ...conversa];
  const ultimaDoRevi = [...mensagens].reverse().find(({ papel }) => papel === 'revi');

  return (
    <Tela bordas={['top']}>
      <View style={styles.cabecalho}>
        <MascoteRevi humor={pensando ? 'neutro' : 'feliz'} aparencia={revi} bloco={3} />
        <View style={styles.textosCabecalho}>
          <Text style={styles.nome}>{revi.nome}</Text>
          <Text style={[styles.status, pensando && styles.statusPensando]}>
            {pensando ? 'pensando…' : chave ? 'online · IA' : 'desconectado'}
          </Text>
        </View>
        {conversa.length > 0 ? (
          <Pressionavel aoPressionar={limpar} escala={0.85} accessibilityLabel="Limpar conversa">
            <IconePixel nome="trash" tamanho={24} cor={cores.cinzaClaro} />
          </Pressionavel>
        ) : null}
      </View>
      <View style={styles.faixa} />

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

                {mensagem.criado ? (
                  <CartaoCriado
                    criado={mensagem.criado}
                    desfeito={mensagem.desfeito}
                    aoVerProjeto={() =>
                      navigation.navigate('ProjetoDetalhe', { id: mensagem.criado.projeto.id })
                    }
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
                  <View style={styles.adicionarTodos}>
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
      <BarraInferior abaAtiva="Conversar" />
    </Tela>
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
    maxWidth: '88%',
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
  adicionarTodos: {
    alignItems: 'flex-start',
  },
  criado: {
    marginTop: 6,
  },
  tituloCriado: {
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
