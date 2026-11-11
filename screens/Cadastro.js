import { useState } from 'react';
import TelaAuth from '../components/TelaAuth';
import CampoTexto from '../components/CampoTexto';
import Botao from '../components/Botao';
import RodapeAuth from '../components/RodapeAuth';
import { ErroFormulario, NotaPrivacidade } from '../components/AvisoConta';
import { ErroConta, useConta } from '../contexto/ContaContexto';
import { erro as vibrarErro } from '../utils/tato';
import { tocar } from '../utils/sons';

const SENHA_MINIMA = 6;
const emailValido = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

export default function Cadastro({ navigation }) {
  const { cadastrar } = useConta();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmacao, setConfirmacao] = useState('');
  const [erro, setErro] = useState('');
  const [criando, setCriando] = useState(false);

  const falhar = (mensagem) => {
    vibrarErro();
    tocar('erro');
    setErro(mensagem);
  };

  // Ao criar, a conta já entra e o app abre do zero (não precisa navegar).
  const confirmar = async () => {
    if (nome.trim() === '') {
      falhar('Digite seu nome.');
      return;
    }
    if (!emailValido(email)) {
      falhar('E-mail inválido.');
      return;
    }
    if (senha.length < SENHA_MINIMA) {
      falhar(`A senha precisa ter pelo menos ${SENHA_MINIMA} caracteres.`);
      return;
    }
    if (senha !== confirmacao) {
      falhar('As senhas não são iguais.');
      return;
    }
    setCriando(true);
    try {
      await cadastrar({ nome, email, senha });
    } catch (falha) {
      falhar(falha instanceof ErroConta ? falha.message : 'Não deu para criar a conta agora.');
      setCriando(false);
    }
  };

  const limparErro = (definir) => (texto) => {
    definir(texto);
    setErro('');
  };

  return (
    <TelaAuth titulo="Crie sua conta" subtitulo="Comece sua jornada agora">
      <CampoTexto
        icone="user"
        placeholder="Nome"
        value={nome}
        onChangeText={limparErro(setNome)}
        autoCapitalize="words"
        maxLength={18}
      />
      <CampoTexto
        icone="mail"
        placeholder="E-mail"
        value={email}
        onChangeText={limparErro(setEmail)}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="email"
      />
      <CampoTexto
        icone="lock"
        placeholder={`Senha (mín. ${SENHA_MINIMA})`}
        value={senha}
        onChangeText={limparErro(setSenha)}
        secureTextEntry
        autoComplete="new-password"
      />
      <CampoTexto
        icone="lock"
        placeholder="Repita a senha"
        value={confirmacao}
        onChangeText={limparErro(setConfirmacao)}
        secureTextEntry
        autoComplete="new-password"
        onSubmitEditing={confirmar}
      />
      <ErroFormulario texto={erro} />
      <Botao
        texto={criando ? 'Criando…' : 'Criar conta'}
        aoPressionar={criando ? null : confirmar}
      />

      <NotaPrivacidade />

      <RodapeAuth
        texto="Já tem conta?"
        textoLink="Entrar"
        aoPressionar={() => navigation.popTo('Login')}
      />
    </TelaAuth>
  );
}
