import { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import { cancelarLembretes } from '../utils/lembretes';

// Contas locais: tudo fica só neste celular, sem servidor nem banco de dados.
// A senha nunca é guardada; só o hash SHA-256 dela com um sal aleatório.
const CHAVE_CONTAS = 'rever:contas:v1';
const CHAVE_SESSAO = 'rever:sessao:v1';
export const chaveDadosDaConta = (contaId) => `rever:dados:v2:${contaId}`;
// Dados da versão antiga, sem login: agora cada conta começa do zero.
const CHAVE_ANTIGA = 'rever:dados:v1';

const ContaContexto = createContext(null);

const normalizarEmail = (email) => email.trim().toLowerCase();

const gerarHash = (senha, sal) =>
  Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, `${sal}:${senha}`);

export class ErroConta extends Error {}

export function ContaProvider({ children }) {
  const [contas, setContas] = useState([]);
  const [contaId, setContaId] = useState(null);
  const [carregada, setCarregada] = useState(false);

  useEffect(() => {
    let ativo = true;
    AsyncStorage.removeItem(CHAVE_ANTIGA).catch(() => {});
    Promise.all([AsyncStorage.getItem(CHAVE_CONTAS), AsyncStorage.getItem(CHAVE_SESSAO)])
      .then(([textoContas, sessao]) => {
        if (!ativo) {
          return;
        }
        const lista = textoContas ? JSON.parse(textoContas) : [];
        setContas(lista);
        if (sessao && lista.some(({ id }) => id === sessao)) {
          setContaId(sessao);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (ativo) {
          setCarregada(true);
        }
      });
    return () => {
      ativo = false;
    };
  }, []);

  const salvarContas = async (lista) => {
    setContas(lista);
    await AsyncStorage.setItem(CHAVE_CONTAS, JSON.stringify(lista));
  };

  const iniciarSessao = async (id) => {
    await AsyncStorage.setItem(CHAVE_SESSAO, id);
    setContaId(id);
  };

  const cadastrar = async ({ nome, email, senha }) => {
    const emailLimpo = normalizarEmail(email);
    if (contas.some((conta) => conta.email === emailLimpo)) {
      throw new ErroConta('Já existe uma conta com esse e-mail neste celular.');
    }
    const sal = Crypto.randomUUID();
    const conta = {
      id: Crypto.randomUUID(),
      nome: nome.trim(),
      email: emailLimpo,
      sal,
      hash: await gerarHash(senha, sal),
      criadaEm: new Date().toISOString(),
    };
    await salvarContas([...contas, conta]);
    await iniciarSessao(conta.id);
  };

  const entrar = async ({ email, senha }) => {
    const conta = contas.find((item) => item.email === normalizarEmail(email));
    // Mesma mensagem para e-mail ou senha errados: não revela quais e-mails existem.
    if (!conta || (await gerarHash(senha, conta.sal)) !== conta.hash) {
      throw new ErroConta('E-mail ou senha incorretos.');
    }
    await iniciarSessao(conta.id);
  };

  const sair = async () => {
    await cancelarLembretes().catch(() => {});
    await AsyncStorage.removeItem(CHAVE_SESSAO);
    setContaId(null);
  };

  // Apaga a conta e todos os dados dela deste celular.
  const apagarConta = async (id) => {
    await AsyncStorage.removeItem(chaveDadosDaConta(id));
    await salvarContas(contas.filter((conta) => conta.id !== id));
    if (id === contaId) {
      await sair();
    }
  };

  const existeEmail = (email) => contas.some((conta) => conta.email === normalizarEmail(email));
  const contaPorEmail = (email) => contas.find((conta) => conta.email === normalizarEmail(email));

  const contaAtual = contas.find(({ id }) => id === contaId) ?? null;

  return (
    <ContaContexto.Provider
      value={{
        carregada,
        conta: contaAtual
          ? {
              id: contaAtual.id,
              nome: contaAtual.nome,
              email: contaAtual.email,
              criadaEm: contaAtual.criadaEm,
            }
          : null,
        cadastrar,
        entrar,
        sair,
        apagarConta,
        temContas: contas.length > 0,
        existeEmail,
        contaPorEmail,
      }}
    >
      {children}
    </ContaContexto.Provider>
  );
}

export const useConta = () => useContext(ContaContexto);
