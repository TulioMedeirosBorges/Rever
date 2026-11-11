import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Tela from '../components/Tela';
import FaixaArcoIris from '../components/FaixaArcoIris';
import Logo from '../components/Logo';
import CampoTexto from '../components/CampoTexto';
import Botao from '../components/Botao';
import LinkTexto from '../components/LinkTexto';
import Divisor from '../components/Divisor';
import { cores, fontes } from '../styles/tema';

export default function Cadastro({ navigation }) {
  const entrar = () => navigation.replace('Inicio');

  return (
    <Tela>
      <ScrollView contentContainerStyle={styles.conteudo} showsVerticalScrollIndicator={false}>
        <FaixaArcoIris altura={6} />
        <View style={styles.topo}>
          <Logo />
          <Text style={styles.titulo}>Crie sua conta</Text>
          <Text style={styles.subtitulo}>Comece sua jornada agora</Text>
        </View>

        <CampoTexto icone="user" placeholder="Nome" />
        <CampoTexto icone="mail" placeholder="E-mail" />
        <CampoTexto icone="lock" placeholder="Senha" secureTextEntry />
        <Botao texto="Criar conta" aoPressionar={entrar} />

        <Divisor texto="ou" />
        <Botao texto="Entrar com Google" variante="claro" icone="google" aoPressionar={entrar} />
        <Botao texto="Entrar com Apple" variante="claro" icone="apple" aoPressionar={entrar} />

        <View style={styles.rodape}>
          <Text style={styles.textoRodape}>Já tem conta ? </Text>
          <LinkTexto texto="Entrar" aoPressionar={() => navigation.popTo('Login')} />
        </View>
      </ScrollView>
    </Tela>
  );
}

const styles = StyleSheet.create({
  conteudo: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 56,
    paddingVertical: 32,
  },
  topo: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 28,
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
    fontSize: 16,
    fontFamily: fontes.negrito,
    fontVariant: fontes.semLigaduras,
  },
});
