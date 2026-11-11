import { StyleSheet, Text, View } from 'react-native';
import Tela from '../components/Tela';
import FaixaArcoIris from '../components/FaixaArcoIris';
import Logo from '../components/Logo';
import CampoTexto from '../components/CampoTexto';
import Botao from '../components/Botao';
import LinkTexto from '../components/LinkTexto';
import { cores } from '../styles/tema';

export default function EsqueceuSenha() {
  return (
    <Tela style={styles.tela}>
      <FaixaArcoIris altura={6} />
      <View style={styles.topo}>
        <Logo />
        <Text style={styles.titulo}>Esqueceu sua senha</Text>
        <Text style={styles.subtitulo}>Forneça seu e-mail para{'\n'}redefinir sua senha</Text>
      </View>

      <CampoTexto icone="email-outline" placeholder="E-mail" />
      <Botao texto="Alterar Senha" />
      <LinkTexto texto="Entrar" />
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
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 8,
  },
  subtitulo: {
    color: cores.branco,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 4,
  },
});
