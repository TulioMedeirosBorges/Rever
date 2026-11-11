import TelaAuth from '../components/TelaAuth';
import CampoTexto from '../components/CampoTexto';
import Botao from '../components/Botao';
import LinkTexto from '../components/LinkTexto';

export default function EsqueceuSenha({ navigation }) {
  return (
    <TelaAuth
      titulo="Esqueceu sua senha"
      subtitulo={'Forneça seu e-mail para\nredefinir sua senha'}
    >
      <CampoTexto
        icone="mail"
        placeholder="E-mail"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Botao texto="Alterar senha" aoPressionar={() => navigation.navigate('VerificarEmail')} />
      <LinkTexto texto="Entrar" aoPressionar={() => navigation.popTo('Login')} />
    </TelaAuth>
  );
}
