import TelaAuth from '../components/TelaAuth';
import CampoTexto from '../components/CampoTexto';
import Botao from '../components/Botao';
import Divisor from '../components/Divisor';
import RodapeAuth from '../components/RodapeAuth';

export default function Cadastro({ navigation }) {
  const entrar = () => navigation.replace('Inicio');

  return (
    <TelaAuth titulo="Crie sua conta" subtitulo="Comece sua jornada agora">
      <CampoTexto icone="user" placeholder="Nome" autoCapitalize="words" />
      <CampoTexto
        icone="mail"
        placeholder="E-mail"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <CampoTexto icone="lock" placeholder="Senha" secureTextEntry />
      <Botao texto="Criar conta" aoPressionar={entrar} />

      <Divisor texto="ou" />
      <Botao texto="Entrar com Google" variante="claro" icone="google" aoPressionar={entrar} />
      <Botao texto="Entrar com Apple" variante="claro" icone="apple" aoPressionar={entrar} />

      <RodapeAuth
        texto="Já tem conta?"
        textoLink="Entrar"
        aoPressionar={() => navigation.popTo('Login')}
      />
    </TelaAuth>
  );
}
