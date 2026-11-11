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
  const [config, setConfig] = useState({ sons: true });
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
          setConfig(salvo.config ?? { sons: true });
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
        JSON.stringify({ habitos, historico, usuario, revi, foco, config }),
      ).catch(() => {});
    }
  }, [carregado, habitos, historico, usuario, revi, foco, config]);

  useEffect(() => {
    definirSonsLigados(config.sons);
  }, [config.sons]);

  // Reagenda as notificações quando os hábitos mudam.
  useEffect(() => {
    if (carregado) {
      sincronizarLembretes(habitos).catch(() => {});
    }
  }, [carregado, habitos]);

  const estatisticas = useMemo(
    () => calcularEstatisticas(habitos, historico, foco),
    [habitos, historico, foco],
  );
  const reviPersonalizado =
    revi.cor !== reviInicial.cor || revi.acessorio !== reviInicial.acessorio || revi.oculos;
  const conquistas = useMemo(
    () => avaliarConquistas({ ...estatisticas, reviPersonalizado }),
    [estatisticas, reviPersonalizado],
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

  const adicionarHabito = (dados) => {
    setHabitos((atuais) => {
      const proximoId = atuais.reduce((maior, { id }) => Math.max(maior, id), 0) + 1;
      return [...atuais, { ...dados, id: proximoId }];
    });
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

  return (
    <HabitosContexto.Provider
      value={{
        carregado,
        habitos: habitosDeHoje,
        historico,
        usuario,
        revi,
        config,
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
      }}
    >
      {children}
    </HabitosContexto.Provider>
  );
}

export const useHabitos = () => useContext(HabitosContexto);
