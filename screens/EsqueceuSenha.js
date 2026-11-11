import { StyleSheet, Text, View } from 'react-native';
import Tela from '../components/Tela';
import FaixaArcoIris from '../components/FaixaArcoIris';
import Logo from '../components/Logo';
import CampoTexto from '../components/CampoTexto';
import Botao from '../components/Botao';
import LinkTexto from '../components/LinkTexto';
import { cores, fontes } from '../styles/tema';

export default function EsqueceuSenha({ navigation }) {
  return (
    <Tela style={styles.tela}>
      <FaixaArcoIris altura={6} />
      <View style={styles.topo}>
        <Logo />
        <Text style={styles.titulo}>Esqueceu sua senha</Text>
        <Text style={styles.subtitulo}>Forneça seu e-mail para{'\n'}redefinir sua senha</Text>
      </View>

      <CampoTexto icone="mail" placeholder="E-mail" />
      <Botao texto="Alterar Senha" aoPressionar={() => navigation.navigate('VerificarEmail')} />
      <LinkTexto texto="Entrar" aoPressionar={() => navigation.popTo('Login')} />
    </Tela>
  );
}

const styles = StyleSheet.create({
  tela: {
    justifyContent: 'center',
    paddingHorizontal: 56,
  },
  topo: {
    alignItems: 'center',
    marginTop: 56,
    marginBottom: 24,
  },
  titulo: {
    color: cores.branco,
    fontSize: 25,
    fontFamily: fontes.negrito,
    fontVariant: fontes.semLigaduras,
    marginTop: 8,
  },
  subtitulo: {
    color: cores.branco,
    fontFamily: fontes.regular,
    fontVariant: fontes.semLigaduras,
    fontSize: 19,
    textAlign: 'center',
    marginTop: 4,
  },
});
