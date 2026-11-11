import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Tela from '../components/Tela';
import FaixaArcoIris from '../components/FaixaArcoIris';
import Logo from '../components/Logo';
import CampoTexto from '../components/CampoTexto';
import Botao from '../components/Botao';
import LinkTexto from '../components/LinkTexto';
import Divisor from '../components/Divisor';
import { cores } from '../styles/tema';

export default function Login({ navigation }) {
  const entrar = () => navigation.replace('Inicio');

  return (
    <Tela>
      <ScrollView contentContainerStyle={styles.conteudo}>
        <FaixaArcoIris altura={6} />
        <View style={styles.topo}>
          <Logo />
          <Text style={styles.titulo}>Bem-vindo de volta!</Text>
          <Text style={styles.subtitulo}>Entre na sua conta</Text>
        </View>

        <CampoTexto icone="email-outline" placeholder="E-mail" />
        <CampoTexto icone="lock-outline" placeholder="Senha" secureTextEntry />
        <Botao texto="Entrar" aoPressionar={entrar} />
        <LinkTexto
          texto="Esqueceu sua senha ?"
          aoPressionar={() => navigation.navigate('EsqueceuSenha')}
        />

        <Divisor texto="ou" />
        <Botao texto="Entrar com Google" variante="claro" icone="google" aoPressionar={entrar} />
        <Botao texto="Entrar com Apple" variante="claro" icone="apple" aoPressionar={entrar} />

        <View style={styles.rodape}>
          <Text style={styles.textoRodape}>Não tem conta ? </Text>
          <LinkTexto texto="Criar conta" aoPressionar={() => navigation.navigate('Cadastro')} />
        </View>
      </ScrollView>
    </Tela>
  );
}

const styles = StyleSheet.create({
  conteudo: {
    paddingHorizontal: 56,
    paddingVertical: 48,
  },
  topo: {
    alignItems: 'center',
    marginTop: 24,
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
    marginTop: 4,
  },
  rodape: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  textoRodape: {
    color: cores.branco,
    fontSize: 14,
    fontWeight: 'bold',
  },
});
