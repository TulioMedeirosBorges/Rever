import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Tela from '../components/Tela';
import PixelsDecorativos from '../components/PixelsDecorativos';
import CabecalhoTela from '../components/CabecalhoTela';
import CampoTexto from '../components/CampoTexto';
import MolduraPixel from '../components/MolduraPixel';
import IconePixel from '../components/IconePixel';
import Botao from '../components/Botao';
import Pressionavel from '../components/Pressionavel';
import MascoteRevi from '../components/MascoteRevi';
import BalaoFala from '../components/BalaoFala';
import Entrada from '../components/Entrada';
import { useHabitos } from '../contexto/HabitosContexto';
import { diasSemana } from '../data/semana';
import { cores, fontes } from '../styles/tema';
import { chaveDia, rotuloData, somarDias } from '../utils/datas';
import { LimiteAtingido, chaveDoAmbiente, lerJson, perguntarGemini } from '../utils/gemini';
import { instrucoesProjeto, pedidoProjeto, planoLocal, validarSessoes } from '../utils/reviIA';
import { erro as vibrarErro } from '../utils/tato';
import { tocar } from '../utils/sons';

const prazosRapidos = [
  { rotulo: '2 semanas', dias: 14 },
  { rotulo: '1 mês', dias: 30 },
  { rotulo: '2 meses', dias: 60 },
  { rotulo: '3 meses', dias: 90 },
];
const vezes = [1, 2, 3, 4, 5];
const duracoes = [25, 45, 60, 90];

const formatarData = (texto) => {
  const d = texto.replace(/\D/g, '').slice(0, 8);
  if (d.length > 4) {
    return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
  }
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
};

// "15/12/2026" -> "2026-12-15" (ou '' se a data não existir)
const paraChave = (texto) => {
  const partes = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(texto);
  if (!partes) {
    return '';
  }
  const data = new Date(Number(partes[3]), Number(partes[2]) - 1, Number(partes[1]));
  const chave = chaveDia(data);
  return chave === `${partes[3]}-${partes[2]}-${partes[1]}` ? chave : '';
};

const paraTexto = (chave) => chave.split('-').reverse().join('/');

function Chip({ rotulo, ativo, aoPressionar, largo }) {
  return (
    <Pressionavel
      aoPressionar={aoPressionar}
      escala={0.88}
      vibracaoSoltar="selecao"
      som="navegar"
      style={largo ? styles.chipLargo : null}
      accessibilityRole="radio"
      accessibilityState={{ selected: ativo }}
    >
      <MolduraPixel corFundo={ativo ? cores.sucesso : cores.cartao} pixel={3} degraus={1}>
        <Text style={[styles.textoChip, ativo && styles.textoChipAtivo]}>{rotulo}</Text>
      </MolduraPixel>
    </Pressionavel>
  );
}

export default function NovoProjeto({ navigation }) {
  const { habitos, revi, config, adicionarProjeto, avisarLimite } = useHabitos();
  const [nome, setNome] = useState('');
  const [objetivo, setObjetivo] = useState('');
  const [prazo, setPrazo] = useState(paraTexto(chaveDia(somarDias(new Date(), 30))));
  const [dias, setDias] = useState([0, 2, 4]);
  const [porSemana, setPorSemana] = useState(3);
  const [minutos, setMinutos] = useState(45);
  const [horario, setHorario] = useState('19:00');
  const [erro, setErro] = useState('');
  const [pensando, setPensando] = useState(false);
  const [plano, setPlano] = useState(null);

  const chave = config.chaveGemini || chaveDoAmbiente;

  const alternarDia = (indice) =>
    setDias((atual) =>
      atual.includes(indice)
        ? atual.filter((dia) => dia !== indice)
        : [...atual, indice].sort((a, b) => a - b),
    );

  const falhar = (mensagem) => {
    vibrarErro();
    tocar('erro');
    setErro(mensagem);
  };

  const planejar = async () => {
    const prazoChave = paraChave(prazo);
    const amanha = chaveDia(somarDias(new Date(), 1));
    if (nome.trim() === '') {
      falhar('Dê um nome ao projeto.');
      return;
    }
    if (!prazoChave || prazoChave < amanha) {
      falhar('Prazo inválido. Use uma data futura, como 15/12/2026.');
      return;
    }
    if (dias.length === 0) {
      falhar('Escolha pelo menos um dia possível.');
      return;
    }
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(horario)) {
      falhar('Horário do lembrete inválido. Use o formato 19:00.');
      return;
    }
    setErro('');
    setPensando(true);

    const pedido = {
      nome: nome.trim(),
      objetivo: objetivo.trim(),
      prazo: prazoChave,
      dias,
      porSemana: Math.min(porSemana, dias.length),
      minutos,
      horario,
    };
    const local = (aviso) => ({ ...planoLocal(pedido, habitos), aviso, pedido });

    try {
      if (!chave) {
        setPlano(local('Sem IA conectada: montei o plano sozinho. Conecte o Gemini na aba Revi.'));
        return;
      }
      const resposta = await perguntarGemini({
        chave,
        instrucoes: instrucoesProjeto({ nomeRevi: revi.nome, habitos }),
        mensagens: [{ papel: 'pessoa', texto: pedidoProjeto(pedido) }],
      });
      const dados = lerJson(resposta);
      const sessoes = validarSessoes(dados?.sessoes, pedido);
      if (sessoes.length === 0) {
        setPlano(local('A IA errou as datas, então organizei eu mesmo.'));
        return;
      }
      setPlano({
        resumo: String(dados?.resumo ?? 'Plano pronto!').slice(0, 200),
        etapas: (Array.isArray(dados?.etapas) ? dados.etapas : [])
          .map((etapa) => String(etapa).slice(0, 40))
          .slice(0, 6),
        sessoes,
        pedido,
      });
      tocar('reviFeliz');
    } catch (falha) {
      if (falha instanceof LimiteAtingido) {
        avisarLimite('projeto');
        setPlano(
          local('Atingi o limite gratuito do Gemini (avisei no chat). Montei o plano sozinho.'),
        );
      } else {
        setPlano(local('Não consegui falar com a IA agora, então montei o plano sozinho.'));
      }
    } finally {
      setPensando(false);
    }
  };

  const salvar = () => {
    adicionarProjeto({
      ...plano.pedido,
      resumo: plano.resumo,
      etapas: plano.etapas,
      sessoes: plano.sessoes,
    });
    tocar('focoFim');
    navigation.goBack();
  };

  return (
    <Tela bordas={['top', 'bottom']}>
      <PixelsDecorativos />
      <View style={styles.cabecalho}>
        <CabecalhoTela titulo="Novo projeto" mostrarVoltar aoVoltar={() => navigation.goBack()} />
      </View>
      <ScrollView
        contentContainerStyle={styles.conteudo}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets
      >
        {plano ? (
          <>
            <View style={styles.conversa}>
              <MascoteRevi humor="radiante" aparencia={revi} bloco={4} />
              <BalaoFala texto={plano.resumo} falando />
            </View>
            {plano.aviso ? (
              <MolduraPixel corFundo={cores.cartaoDestaque} corTopo={cores.amarelo} pixel={3}>
                <View style={styles.aviso}>
                  <IconePixel nome="zap" tamanho={18} cor={cores.amarelo} />
                  <Text style={styles.textoAviso}>{plano.aviso}</Text>
                </View>
              </MolduraPixel>
            ) : null}

            {plano.etapas.length > 0 ? (
              <>
                <Text style={styles.rotulo}>Etapas</Text>
                <View style={styles.etapas}>
                  {plano.etapas.map((etapa, indice) => (
                    <Entrada key={etapa} ordem={indice} tipo="escala">
                      <MolduraPixel corFundo={cores.cartao} pixel={2} degraus={1}>
                        <Text style={styles.textoEtapa}>{`${indice + 1}. ${etapa}`}</Text>
                      </MolduraPixel>
                    </Entrada>
                  ))}
                </View>
              </>
            ) : null}

            <Text style={styles.rotulo}>{`${plano.sessoes.length} sessões de foco`}</Text>
            {plano.sessoes.map((sessao, indice) => (
              <Entrada key={sessao.id} ordem={indice}>
                <MolduraPixel corFundo={cores.cartao} pixel={3} style={styles.sessao}>
                  <View style={styles.linhaSessao}>
                    <Text style={styles.dataSessao}>{rotuloData(sessao.data)}</Text>
                    <Text style={styles.tituloSessao} numberOfLines={1}>
                      {sessao.titulo}
                    </Text>
                    <Text style={styles.minutosSessao}>{`${sessao.minutos}m`}</Text>
                  </View>
                </MolduraPixel>
              </Entrada>
            ))}

            <View style={styles.acoes}>
              <Botao texto="Salvar projeto" aoPressionar={salvar} />
              <Botao texto="Refazer plano" variante="claro" aoPressionar={() => setPlano(null)} />
            </View>
          </>
        ) : (
          <>
            <Text style={styles.rotulo}>Nome do projeto</Text>
            <CampoTexto
              icone="clipboard-note"
              placeholder="Ex.: TCC, app, livro…"
              value={nome}
              onChangeText={setNome}
              maxLength={30}
            />

            <Text style={styles.rotulo}>Objetivo</Text>
            <CampoTexto
              icone="target"
              placeholder="O que precisa estar pronto?"
              value={objetivo}
              onChangeText={setObjetivo}
              maxLength={120}
            />

            <Text style={styles.rotulo}>Prazo</Text>
            <CampoTexto
              icone="calendar-2"
              placeholder="15/12/2026"
              value={prazo}
              onChangeText={(texto) => setPrazo(formatarData(texto))}
              keyboardType="number-pad"
              maxLength={10}
            />
            <View style={styles.linhaChips}>
              {prazosRapidos.map(({ rotulo, dias: quantos }) => {
                const valor = paraTexto(chaveDia(somarDias(new Date(), quantos)));
                return (
                  <Chip
                    key={rotulo}
                    rotulo={rotulo}
                    ativo={prazo === valor}
                    aoPressionar={() => setPrazo(valor)}
                  />
                );
              })}
            </View>

            <Text style={styles.rotulo}>Dias em que posso focar</Text>
            <View style={styles.linhaDias}>
              {diasSemana.map((dia, indice) => (
                <Chip
                  key={`${dia}-${indice}`}
                  rotulo={dia}
                  ativo={dias.includes(indice)}
                  aoPressionar={() => alternarDia(indice)}
                  largo
                />
              ))}
            </View>

            <Text style={styles.rotulo}>Vezes por semana</Text>
            <View style={styles.linhaChips}>
              {vezes.map((valor) => (
                <Chip
                  key={valor}
                  rotulo={`${valor}x`}
                  ativo={valor === porSemana}
                  aoPressionar={() => setPorSemana(valor)}
                  largo
                />
              ))}
            </View>

            <Text style={styles.rotulo}>Tempo por sessão</Text>
            <View style={styles.linhaChips}>
              {duracoes.map((valor) => (
                <Chip
                  key={valor}
                  rotulo={`${valor} min`}
                  ativo={valor === minutos}
                  aoPressionar={() => setMinutos(valor)}
                  largo
                />
              ))}
            </View>

            <Text style={styles.rotulo}>Horário do lembrete</Text>
            <CampoTexto
              icone="bell"
              placeholder="19:00"
              value={horario}
              onChangeText={(texto) => {
                const d = texto.replace(/\D/g, '').slice(0, 4);
                setHorario(d.length > 2 ? `${d.slice(0, 2)}:${d.slice(2)}` : d);
              }}
              keyboardType="number-pad"
              maxLength={5}
            />

            <View style={styles.acoes}>
              {erro !== '' ? <Text style={styles.erro}>{erro}</Text> : null}
              {pensando ? (
                <View style={styles.conversa}>
                  <MascoteRevi humor="neutro" aparencia={revi} bloco={4} />
                  <BalaoFala texto="Olhando sua semana e montando o plano…" />
                </View>
              ) : (
                <Botao texto={`Planejar com o ${revi.nome}`} aoPressionar={planejar} />
              )}
            </View>
          </>
        )}
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
  rotulo: {
    color: cores.branco,
    fontFamily: fontes.negrito,
    fontVariant: fontes.semLigaduras,
    fontSize: 18,
    marginTop: 14,
  },
  linhaChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  linhaDias: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 10,
  },
  chipLargo: {
    flex: 1,
  },
  textoChip: {
    color: cores.branco,
    fontFamily: fontes.media,
    fontVariant: fontes.semLigaduras,
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  textoChipAtivo: {
    color: cores.preto,
  },
  acoes: {
    marginTop: 22,
  },
  erro: {
    color: cores.perigo,
    fontFamily: fontes.media,
    fontVariant: fontes.semLigaduras,
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 4,
  },
  conversa: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
  aviso: {
    flexDirection: 'row',
    gap: 8,
    padding: 12,
    paddingTop: 14,
  },
  textoAviso: {
    flex: 1,
    color: cores.branco,
    fontFamily: fontes.regular,
    fontVariant: fontes.semLigaduras,
    fontSize: 14,
    lineHeight: 19,
  },
  etapas: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  textoEtapa: {
    color: cores.branco,
    fontFamily: fontes.media,
    fontVariant: fontes.semLigaduras,
    fontSize: 13,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  sessao: {
    marginTop: 8,
  },
  linhaSessao: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 44,
  },
  dataSessao: {
    width: 72,
    color: cores.turquesa,
    fontFamily: fontes.negrito,
    fontVariant: fontes.semLigaduras,
    fontSize: 13,
  },
  tituloSessao: {
    flex: 1,
    color: cores.branco,
    fontFamily: fontes.regular,
    fontVariant: fontes.semLigaduras,
    fontSize: 14,
  },
  minutosSessao: {
    color: cores.cinzaClaro,
    fontFamily: fontes.media,
    fontVariant: fontes.semLigaduras,
    fontSize: 13,
    marginLeft: 8,
  },
});
