import TelaAuth from '../components/TelaAuth';
import CampoTexto from '../components/CampoTexto';
import Botao from '../components/Botao';
import LinkTexto from '../components/LinkTexto';
import Divisor from '../components/Divisor';
import RodapeAuth from '../components/RodapeAuth';

export default function Login({ navigation }) {
  const entrar = () => navigation.replace('Inicio');

  return (
    <TelaAuth titulo="Bem-vindo de volta!" subtitulo="Entre na sua conta">
      <CampoTexto
        icone="mail"
        placeholder="E-mail"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <CampoTexto icone="lock" placeholder="Senha" secureTextEntry />
      <Botao texto="Entrar" aoPressionar={entrar} />
      <LinkTexto
        texto="Esqueceu sua senha?"
        aoPressionar={() => navigation.navigate('EsqueceuSenha')}
      />

      <Divisor texto="ou" />
      <Botao texto="Entrar com Google" variante="claro" icone="google" aoPressionar={entrar} />
      <Botao texto="Entrar com Apple" variante="claro" icone="apple" aoPressionar={entrar} />

      <RodapeAuth
        texto="Não tem conta?"
        textoLink="Criar conta"
        aoPressionar={() => navigation.navigate('Cadastro')}
      />
    </TelaAuth>
  );
}
