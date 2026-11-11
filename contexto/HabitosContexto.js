import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { criarHistoricoInicial, habitos as habitosIniciais, usuarioInicial } from '../data/habitos';
import { avaliarConquistas } from '../data/conquistas';
import { reviInicial } from '../data/revi';
import { calcularEstatisticas } from '../utils/estatisticas';
import { sincronizarLembretes } from '../utils/lembretes';
import { chaveDia } from '../utils/datas';
import { definirSonsLigados } from '../utils/sons';
import { cores } from '../styles/tema';

const CHAVE = 'rever:dados:v1';

const HabitosContexto = createContext(null);

export function HabitosProvider({ children }) {
  const [habitos, setHabitos] = useState(habitosIniciais);
  const [historico, setHistorico] = useState(() => criarHistoricoInicial());
  const [usuario, setUsuario] = useState(usuarioInicial);
  const [revi, setRevi] = useState(reviInicial);
  const [foco, setFoco] = useState({ sessoes: 0, minutos: 0 });
  const [config, setConfig] = useState({ sons: true, chaveGemini: '' });
  const [conversa, setConversa] = useState([]);
  const [projetos, setProjetos] = useState([]);
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
          setConfig({ sons: true, chaveGemini: '', ...salvo.config });
          setConversa(salvo.conversa ?? []);
          setProjetos(salvo.projetos ?? []);
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
  }, []);

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
          conversa: conversa.slice(-60),
          projetos,
        }),
      ).catch(() => {});
    }
  }, [carregado, habitos, historico, usuario, revi, foco, config, conversa, projetos]);

  useEffect(() => {
    definirSonsLigados(config.sons);
  }, [config.sons]);

  // Reagenda as notificações quando os hábitos mudam.
  useEffect(() => {
    if (carregado) {
      sincronizarLembretes(habitos, projetos).catch(() => {});
    }
  }, [carregado, habitos, projetos]);

  const estatisticas = useMemo(
    () => calcularEstatisticas(habitos, historico, foco),
    [habitos, historico, foco],
  );
  const reviPersonalizado =
    revi.cor !== reviInicial.cor || revi.acessorio !== reviInicial.acessorio || revi.oculos;
  const conquistas = useMemo(
    () => avaliarConquistas({ ...estatisticas, reviPersonalizado, projetos: projetos.length }),
    [estatisticas, reviPersonalizado, projetos.length],
  );

  // Avisa sobre conquistas que acabaram de abrir (não as que já estavam abertas ao carregar).
  useEffect(() => {
    if (!carregado) {
      return;
    }
    const abertas = conquistas.filter(({ desbloqueada }) => desbloqueada);
    if (desbloqueadasAntes.current) {
      const novas = abertas.filter(({ id }) => !desbloqueadasAntes.current.has(id));
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
    if (nivelAntes.current !== null && estatisticas.nivel > nivelAntes.current) {
      setAvisos((atuais) => [
        ...atuais,
        {
          id: `nivel-${estatisticas.nivel}`,
          tipo: 'nivel',
          titulo: 'Subiu de nível!',
          nome: `${revi.nome} chegou ao nível ${estatisticas.nivel}`,
          icone: 'heart',
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

  const alternarConcluido = (id, data = new Date()) => {
    const chave = chaveDia(data);
    setHistorico((atual) => {
      const feitos = atual[chave] ?? [];
      return {
        ...atual,
        [chave]: feitos.includes(id) ? feitos.filter((item) => item !== id) : [...feitos, id],
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
    setHabitos((atuais) => [...atuais, { ...dados, id }]);
    return id;
  };

  const editarHabito = (id, dados) => {
    setHabitos((atuais) =>
      atuais.map((habito) => (habito.id === id ? { ...habito, ...dados } : habito)),
    );
  };

  const excluirHabito = (id) => {
    setHabitos((atuais) => atuais.filter((habito) => habito.id !== id));
  };

  const atualizarUsuario = (dados) => setUsuario((atual) => ({ ...atual, ...dados }));

  const atualizarRevi = (dados) => setRevi((atual) => ({ ...atual, ...dados }));

  const alternarSons = () => setConfig((atual) => ({ ...atual, sons: !atual.sons }));

  // Sessão de foco terminada: soma minutos e marca o hábito de hoje, se ainda não estiver feito.
  const registrarFoco = (minutos, habitoId) => {
    setFoco((atual) => ({ sessoes: atual.sessoes + 1, minutos: atual.minutos + minutos }));
    if (habitoId && !feitosHoje.includes(habitoId)) {
      alternarConcluido(habitoId);
    }
  };

  const dispensarAviso = useCallback(() => setAvisos((atuais) => atuais.slice(1)), []);

  const definirChaveGemini = (chave) =>
    setConfig((atual) => ({ ...atual, chaveGemini: chave.trim() }));

  // ----- Conversa com o Revi -----
  const adicionarMensagem = (mensagem) =>
    setConversa((atual) => [...atual, { id: `${Date.now()}-${atual.length}`, ...mensagem }]);

  const marcarSugestaoAdicionada = (mensagemId, indice) =>
    setConversa((atual) =>
      atual.map((mensagem) =>
        mensagem.id === mensagemId
          ? { ...mensagem, adicionadas: [...(mensagem.adicionadas ?? []), indice] }
          : mensagem,
      ),
    );

  const atualizarMensagem = (mensagemId, dados) =>
    setConversa((atual) =>
      atual.map((mensagem) => (mensagem.id === mensagemId ? { ...mensagem, ...dados } : mensagem)),
    );

  const limparConversa = () => setConversa([]);

  // Quando a cota gratuita do Gemini acaba, o Revi avisa no chat (no máximo uma vez por hora).
  const avisarLimite = () =>
    setConversa((atual) => {
      const ultimo = [...atual].reverse().find(({ tipo }) => tipo === 'limite');
      if (ultimo && Date.now() - ultimo.criadaEm < 60 * 60 * 1000) {
        return atual;
      }
      return [
        ...atual,
        {
          id: `${Date.now()}-limite`,
          papel: 'revi',
          tipo: 'limite',
          criadaEm: Date.now(),
          texto:
            'Atingi o limite gratuito do Gemini por agora. Ele volta sozinho: espera uns minutos, ou até amanhã se for o limite do dia. Enquanto isso, planejo seus projetos aqui mesmo, sem IA.',
        },
      ];
    });

  // ----- Projetos -----
  const adicionarProjeto = (projeto) => {
    const id = `p${novoId()}`;
    setProjetos((atuais) => [...atuais, { ...projeto, id, criadoEm: chaveDia(new Date()) }]);
    return id;
  };

  const mudarSessao = (projetoId, sessaoId, mudar) =>
    setProjetos((atuais) =>
      atuais.map((projeto) =>
        projeto.id === projetoId
          ? {
              ...projeto,
              sessoes: projeto.sessoes.map((sessao) =>
                sessao.id === sessaoId ? { ...sessao, feita: mudar(sessao.feita) } : sessao,
              ),
            }
          : projeto,
      ),
    );

  const alternarSessao = (projetoId, sessaoId) =>
    mudarSessao(projetoId, sessaoId, (feita) => !feita);

  const concluirSessao = (projetoId, sessaoId) => mudarSessao(projetoId, sessaoId, () => true);

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
        conversa,
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
        atualizarMensagem,
        avisarLimite,
        adicionarProjeto,
        alternarSessao,
        concluirSessao,
        excluirProjeto,
      }}
    >
      {children}
    </HabitosContexto.Provider>
  );
}

export const useHabitos = () => useContext(HabitosContexto);
