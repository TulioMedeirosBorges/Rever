import { useState } from 'react';
import TelaAuth from '../components/TelaAuth';
import CampoTexto from '../components/CampoTexto';
import Botao from '../components/Botao';
import LinkTexto from '../components/LinkTexto';
import RodapeAuth from '../components/RodapeAuth';
import { ErroFormulario, NotaPrivacidade } from '../components/AvisoConta';
import { ErroConta, useConta } from '../contexto/ContaContexto';
import { erro as vibrarErro } from '../utils/tato';
import { tocar } from '../utils/sons';

export default function Login({ navigation }) {
  const { entrar } = useConta();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [entrando, setEntrando] = useState(false);

  const falhar = (mensagem) => {
    vibrarErro();
    tocar('erro');
    setErro(mensagem);
  };

  // Ao entrar, o app troca sozinho para as telas da conta (não precisa navegar).
  const confirmar = async () => {
    if (!email.trim() || !senha) {
      falhar('Preencha e-mail e senha.');
      return;
    }
    setEntrando(true);
    try {
      await entrar({ email, senha });
    } catch (falha) {
      falhar(falha instanceof ErroConta ? falha.message : 'Não deu para entrar agora.');
      setEntrando(false);
    }
  };

  const limparErro = (definir) => (texto) => {
    definir(texto);
    setErro('');
  };

  return (
    <TelaAuth titulo="Bem-vindo de volta!" subtitulo="Entre na sua conta">
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
        placeholder="Senha"
        value={senha}
        onChangeText={limparErro(setSenha)}
        secureTextEntry
        autoComplete="current-password"
        onSubmitEditing={confirmar}
      />
      <ErroFormulario texto={erro} />
      <Botao texto={entrando ? 'Entrando…' : 'Entrar'} aoPressionar={entrando ? null : confirmar} />
      <LinkTexto
        texto="Esqueceu sua senha?"
        aoPressionar={() => navigation.navigate('EsqueceuSenha')}
      />

      <NotaPrivacidade />

      <RodapeAuth
        texto="Não tem conta?"
        textoLink="Criar conta"
        aoPressionar={() => navigation.navigate('Cadastro')}
      />
    </TelaAuth>
  );
}
