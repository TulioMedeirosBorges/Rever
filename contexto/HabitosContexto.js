import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { usuarioInicial } from "../data/habitos";
import { chaveDadosDaConta } from "./ContaContexto";
import { avaliarConquistas } from "../data/conquistas";
import { reviInicial, rostoDe } from "../data/revi";
import { calcularEstatisticas } from "../utils/estatisticas";
import { sincronizarLembretes } from "../utils/lembretes";
import { chaveDia } from "../utils/datas";
import { definirSonsLigados } from "../utils/sons";
import { cores } from "../styles/tema";

const HabitosContexto = createContext(null);

// Cada conta tem os seus dados, guardados só neste celular. Conta nova começa do zero.
export function HabitosProvider({ conta, children }) {
  const CHAVE = chaveDadosDaConta(conta.id);
  const [habitos, setHabitos] = useState([]);
  const [historico, setHistorico] = useState({});
  const [usuario, setUsuario] = useState(() => ({
    ...usuarioInicial,
    nome: conta.nome,
    email: conta.email,
    membroDesde: conta.criadaEm.slice(0, 10),
  }));
  const [revi, setRevi] = useState(reviInicial);
  const [foco, setFoco] = useState({ sessoes: 0, minutos: 0 });
  const [config, setConfig] = useState({ sons: true, chaveGemini: "" });
  const [conversas, setConversas] = useState({ rotina: [], projeto: [] });
  const [projetos, setProjetos] = useState([]);
  // Horários adiados só para o dia: { 'AAAA-MM-DD': { chaveDoItem: 'HH:MM' } }.
  const [adiamentos, setAdiamentos] = useState({});
  // Conversas antigas com o Revi (vão para cá quando a pessoa sai da tela do chat).
  const [arquivo, setArquivo] = useState({ rotina: [], projeto: [] });
  // Atividades que a pessoa confirmou que não vai fazer: { 'AAAA-MM-DD': [chaveDoItem] }.
  const [pulados, setPulados] = useState({});
  const conversasAtuais = useRef(conversas);
  conversasAtuais.current = conversas;
  const nivelAntes = useRef(null);
  const [carregado, setCarregado] = useState(false);
  const [avisos, setAvisos] = useState([]);
  const desbloqueadasAntes = useRef(null);

  // Carrega o que foi salvo no aparelho.
  useEffect(() => {
    let ativo = true;

    AsyncStorage.getItem(CHAVE)
      .then((texto) => {
        if (ativo && texto) {
          const salvo = JSON.parse(texto);
          setHabitos(salvo.habitos);
          setHistorico(salvo.historico);
          setUsuario(salvo.usuario);
          setRevi(salvo.revi ?? reviInicial);
          setFoco(salvo.foco ?? { sessoes: 0, minutos: 0 });
          setConfig({ sons: true, chaveGemini: "", ...salvo.config });
          setConversas({
            rotina: salvo.conversas?.rotina ?? salvo.conversa ?? [],
            projeto: salvo.conversas?.projeto ?? [],
          });
          setProjetos(salvo.projetos ?? []);
          // Adiamentos de dias que já passaram não servem mais.
          const hojeChave = chaveDia(new Date());
          setAdiamentos(
            Object.fromEntries(
              Object.entries(salvo.adiamentos ?? {}).filter(
                ([dia]) => dia >= hojeChave,
              ),
            ),
          );
          setPulados(
            Object.fromEntries(
              Object.entries(salvo.pulados ?? {}).filter(
                ([dia]) => dia >= hojeChave,
              ),
            ),
          );
          setArquivo({
            rotina: salvo.arquivo?.rotina ?? [],
            projeto: salvo.arquivo?.projeto ?? [],
          });
        }
      })
      .catch(() => {})
      .finally(() => {
        if (ativo) {
          setCarregado(true);
        }
      });

    return () => {
      ativo = false;
    };
  }, [CHAVE]);

  // Salva a cada mudança.
  useEffect(() => {
    if (carregado) {
      AsyncStorage.setItem(
        CHAVE,
        JSON.stringify({
          habitos,
          historico,
          usuario,
          revi,
          foco,
          config,
          conversas: {
            rotina: conversas.rotina.slice(-60),
            projeto: conversas.projeto.slice(-60),
          },
          projetos,
          adiamentos,
          pulados,
          arquivo,
        }),
      ).catch(() => {});
    }
  }, [
    CHAVE,
    carregado,
    habitos,
    historico,
    usuario,
    revi,
    foco,
    config,
    conversas,
    projetos,
    adiamentos,
    pulados,
    arquivo,
  ]);

  useEffect(() => {
    definirSonsLigados(config.sons);
  }, [config.sons]);

  const feitosHojeSync = historico[chaveDia(new Date())] ?? [];
  const feitosHojeChave = feitosHojeSync.join(",");

  // Reagenda as notificações quando os hábitos mudam.
  useEffect(() => {
    if (carregado) {
      sincronizarLembretes({
        habitos,
        projetos,
        feitosHoje: feitosHojeSync,
        adiamentos,
        puladosHoje: pulados[chaveDia(new Date())] ?? [],
      }).catch(() => {});
    }
  }, [carregado, habitos, projetos, feitosHojeChave, adiamentos, pulados]);

  const estatisticas = useMemo(
    () => calcularEstatisticas(habitos, historico, foco),
    [habitos, historico, foco],
  );
  const reviPersonalizado =
    revi.cor !== reviInicial.cor ||
    revi.acessorio !== reviInicial.acessorio ||
    rostoDe(revi) !== "nenhum";
  const conquistas = useMemo(
    () =>
      avaliarConquistas({
        ...estatisticas,
        reviPersonalizado,
        projetos: projetos.length,
      }),
    [estatisticas, reviPersonalizado, projetos.length],
  );

  // Avisa sobre conquistas que acabaram de abrir (não as que já estavam abertas ao carregar).
  useEffect(() => {
    if (!carregado) {
      return;
    }
    const abertas = conquistas.filter(({ desbloqueada }) => desbloqueada);
    if (desbloqueadasAntes.current) {
      const novas = abertas.filter(
        ({ id }) => !desbloqueadasAntes.current.has(id),
      );
      if (novas.length > 0) {
        setAvisos((atuais) => [...atuais, ...novas]);
      }
    }
    desbloqueadasAntes.current = new Set(abertas.map(({ id }) => id));
  }, [carregado, conquistas]);

  // Avisa quando o Revi sobe de nível.
  useEffect(() => {
    if (!carregado) {
      return;
    }
    if (
      nivelAntes.current !== null &&
      estatisticas.nivel > nivelAntes.current
    ) {
      setAvisos((atuais) => [
        ...atuais,
        {
          id: `nivel-${estatisticas.nivel}`,
          tipo: "nivel",
          titulo: "Subiu de nível!",
          nome: `${revi.nome} chegou ao nível ${estatisticas.nivel}`,
          icone: "heart",
          cor: cores.amarelo,
        },
      ]);
    }
    nivelAntes.current = estatisticas.nivel;
  }, [carregado, estatisticas.nivel, revi.nome]);

  const feitosHoje = historico[chaveDia(new Date())] ?? [];
  const habitosDeHoje = habitos.map((habito) => ({
    ...habito,
    concluido: feitosHoje.includes(habito.id),
  }));

  // Só dá para marcar o dia de hoje: dia que passou fica como está, e dia futuro ainda não chegou.
  const alternarConcluido = (id, data = new Date()) => {
    const chave = chaveDia(data);
    if (chave !== chaveDia(new Date())) {
      return;
    }
    setHistorico((atual) => {
      const feitos = atual[chave] ?? [];
      return {
        ...atual,
        [chave]: feitos.includes(id)
          ? feitos.filter((item) => item !== id)
          : [...feitos, id],
      };
    });
  };

  // Ids por tempo: dá para criar vários de uma vez (o Revi faz isso) sem repetir.
  const novoId = (() => {
    let ultimo = 0;
    return () => {
      ultimo = Math.max(Date.now(), ultimo + 1);
      return ultimo;
    };
  })();

  const adicionarHabito = (dados) => {
    const id = novoId();
    setHabitos((atuais) => [
      ...atuais,
      { ...dados, id, criadoEm: chaveDia(new Date()) },
    ]);
    return id;
  };

  const editarHabito = (id, dados) => {
    setHabitos((atuais) =>
      atuais.map((habito) =>
        habito.id === id ? { ...habito, ...dados } : habito,
      ),
    );
  };

  const excluirHabito = (id) => {
    setHabitos((atuais) => atuais.filter((habito) => habito.id !== id));
  };

  const atualizarUsuario = (dados) =>
    setUsuario((atual) => ({ ...atual, ...dados }));

  const atualizarRevi = (dados) => setRevi((atual) => ({ ...atual, ...dados }));

  const alternarSons = () =>
    setConfig((atual) => ({ ...atual, sons: !atual.sons }));

  // Sessão de foco terminada: soma minutos e marca o hábito de hoje, se ainda não estiver feito.
  const registrarFoco = (minutos, habitoId) => {
    setFoco((atual) => ({
      sessoes: atual.sessoes + 1,
      minutos: atual.minutos + minutos,
    }));
    if (habitoId && !feitosHoje.includes(habitoId)) {
      alternarConcluido(habitoId);
    }
  };

  const dispensarAviso = useCallback(
    () => setAvisos((atuais) => atuais.slice(1)),
    [],
  );

  const definirChaveGemini = (chave) =>
    setConfig((atual) => ({ ...atual, chaveGemini: chave.trim() }));

  // ----- Conversas com o Revi: uma para a rotina (aba Revi) e outra para projetos -----
  const mudarCanal = (canal, mudar) =>
    setConversas((atuais) => ({
      ...atuais,
      [canal]: mudar(atuais[canal] ?? []),
    }));

  const adicionarMensagem = (canal, mensagem) =>
    mudarCanal(canal, (atual) => [
      ...atual,
      { id: `${novoId()}`, ...mensagem },
    ]);

  const atualizarMensagem = (canal, mensagemId, dados) =>
    mudarCanal(canal, (atual) =>
      atual.map((mensagem) =>
        mensagem.id === mensagemId ? { ...mensagem, ...dados } : mensagem,
      ),
    );

  const marcarSugestaoAdicionada = (canal, mensagemId, indice) =>
    mudarCanal(canal, (atual) =>
      atual.map((mensagem) =>
        mensagem.id === mensagemId
          ? {
              ...mensagem,
              adicionadas: [...(mensagem.adicionadas ?? []), indice],
            }
          : mensagem,
      ),
    );

  const limparConversa = (canal) => mudarCanal(canal, () => []);

  // Guarda a conversa atual no histórico e começa uma nova (só se a pessoa falou algo).
  // Lê a conversa mais recente por referência: quem chama é a tela saindo de foco,
  // que pode ter uma cópia antiga dos dados.
  const arquivarConversa = (canal) => {
    const mensagens = conversasAtuais.current[canal] ?? [];
    const primeira = mensagens.find(({ papel }) => papel === "pessoa");
    if (!primeira) {
      return;
    }
    conversasAtuais.current = { ...conversasAtuais.current, [canal]: [] };
    setArquivo((antigos) => ({
      ...antigos,
      [canal]: [
        {
          id: `c${Date.now()}`,
          titulo: primeira.texto.slice(0, 60),
          data: new Date().toISOString(),
          mensagens,
        },
        ...(antigos[canal] ?? []).filter(
          ({ mensagens: outras }) => outras !== mensagens,
        ),
      ].slice(0, 30),
    }));
    setConversas((atuais) => ({ ...atuais, [canal]: [] }));
  };

  // Volta uma conversa do histórico para continuar de onde parou.
  const continuarConversa = (canal, id) => {
    const escolhida = (arquivo[canal] ?? []).find(
      (conversa) => conversa.id === id,
    );
    if (!escolhida) {
      return;
    }
    arquivarConversa(canal);
    setArquivo((antigos) => ({
      ...antigos,
      [canal]: (antigos[canal] ?? []).filter((conversa) => conversa.id !== id),
    }));
    setConversas((atuais) => ({ ...atuais, [canal]: escolhida.mensagens }));
  };

  const apagarDoHistorico = (canal, id) =>
    setArquivo((antigos) => ({
      ...antigos,
      [canal]: (antigos[canal] ?? []).filter((conversa) => conversa.id !== id),
    }));

  // Quando a cota gratuita do Gemini acaba, o Revi avisa no chat (no máximo uma vez por hora).
  const avisarLimite = (canal = "rotina") =>
    mudarCanal(canal, (atual) => {
      const ultimo = [...atual].reverse().find(({ tipo }) => tipo === "limite");
      if (ultimo && Date.now() - ultimo.criadaEm < 60 * 60 * 1000) {
        return atual;
      }
      return [
        ...atual,
        {
          id: `${novoId()}-limite`,
          papel: "revi",
          tipo: "limite",
          criadaEm: Date.now(),
          texto:
            "Atingi o limite gratuito do Gemini por agora. Ele volta sozinho: espera uns minutos, ou até amanhã se for o limite do dia. Enquanto isso, dá para criar projetos pelo formulário, que eu planejo aqui mesmo, sem IA.",
        },
      ];
    });

  // ----- Projetos -----
  const coresProjeto = [
    cores.turquesa,
    cores.laranja,
    cores.amarelo,
    cores.vermelho,
    cores.creme,
  ];

  const adicionarProjeto = (projeto) => {
    const id = `p${novoId()}`;
    setProjetos((atuais) => [
      ...atuais,
      {
        icone: "clipboard-note",
        cor: coresProjeto[atuais.length % coresProjeto.length],
        ...projeto,
        id,
        criadoEm: chaveDia(new Date()),
      },
    ]);
    return id;
  };

  // Sessão de um dia que já passou não pode mais ser marcada (adiantar uma futura pode).
  const mudarSessao = (projetoId, sessaoId, mudar) =>
    setProjetos((atuais) =>
      atuais.map((projeto) =>
        projeto.id === projetoId &&
        !projeto.sessoes.some(
          ({ id, data }) => id === sessaoId && data < chaveDia(new Date()),
        )
          ? {
              ...projeto,
              sessoes: projeto.sessoes.map((sessao) =>
                sessao.id === sessaoId
                  ? { ...sessao, ...mudar(sessao) }
                  : sessao,
              ),
            }
          : projeto,
      ),
    );

  const alternarSessao = (projetoId, sessaoId) =>
    mudarSessao(projetoId, sessaoId, (sessao) => ({ feita: !sessao.feita }));

  const concluirSessao = (projetoId, sessaoId) =>
    mudarSessao(projetoId, sessaoId, () => ({ feita: true }));

  // Marca uma tarefa do dia; com todas feitas, a sessão inteira conta como feita.
  const alternarTarefa = (projetoId, sessaoId, indice) =>
    mudarSessao(projetoId, sessaoId, (sessao) => {
      const atuais = sessao.tarefasFeitas ?? [];
      const tarefasFeitas = atuais.includes(indice)
        ? atuais.filter((item) => item !== indice)
        : [...atuais, indice];
      const todas =
        (sessao.tarefas ?? []).length > 0 &&
        tarefasFeitas.length === sessao.tarefas.length;
      return { tarefasFeitas, feita: todas };
    });

  // A pessoa confirmou que não vai fazer a atividade hoje: param os avisos dela por hoje.
  const pularHoje = (chaveItem) => {
    const hoje = chaveDia(new Date());
    setPulados((atuais) => ({
      ...atuais,
      [hoje]: [...new Set([...(atuais[hoje] ?? []), chaveItem])],
    }));
  };

  // Adia um item só hoje (o horário normal volta amanhã) e reagenda os lembretes.
  const adiarHoje = (chaveItem, horario) => {
    const hoje = chaveDia(new Date());
    setAdiamentos((atuais) => ({
      ...atuais,
      [hoje]: { ...(atuais[hoje] ?? {}), [chaveItem]: horario },
    }));
  };

  const excluirProjeto = (id) =>
    setProjetos((atuais) => atuais.filter((projeto) => projeto.id !== id));

  return (
    <HabitosContexto.Provider
      value={{
        carregado,
        habitos: habitosDeHoje,
        historico,
        usuario,
        revi,
        config,
        conversas,
        projetos,
        estatisticas,
        conquistas,
        aviso: avisos[0] ?? null,
        alternarConcluido,
        adicionarHabito,
        editarHabito,
        excluirHabito,
        atualizarUsuario,
        atualizarRevi,
        alternarSons,
        registrarFoco,
        dispensarAviso,
        definirChaveGemini,
        adicionarMensagem,
        marcarSugestaoAdicionada,
        limparConversa,
        arquivo,
        arquivarConversa,
        continuarConversa,
        apagarDoHistorico,
        atualizarMensagem,
        avisarLimite,
        adicionarProjeto,
        alternarSessao,
        concluirSessao,
        excluirProjeto,
        alternarTarefa,
        adiamentosHoje: adiamentos[chaveDia(new Date())] ?? {},
        adiarHoje,
        puladosHoje: pulados[chaveDia(new Date())] ?? [],
        pularHoje,
      }}
    >
      {children}
    </HabitosContexto.Provider>
  );
}

export const useHabitos = () => useContext(HabitosContexto);
