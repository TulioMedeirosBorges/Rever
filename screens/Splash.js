import { Image, StyleSheet, Text, View } from 'react-native';
import Tela from '../components/Tela';
import Logo from '../components/Logo';
import Botao from '../components/Botao';
import LinkTexto from '../components/LinkTexto';
import { cores } from '../styles/tema';

export default function Splash() {
  return (
    <Tela style={styles.tela}>
      <Image source={require('../assets/imagens/splash-r.png')} style={styles.imagem} />
      <View style={styles.conteudo}>
        <Logo />
        <Text style={styles.frase}>Pequenos hábitos,{'\n'}grandes mudanças.</Text>
        <Botao texto="Começar" />
        <LinkTexto texto="Entrar" />
      </View>
    </Tela>
  );
}

const styles = StyleSheet.create({
  tela: {
    justifyContent: 'center',
  },
  imagem: {
    width: '100%',
    height: 275,
    resizeMode: 'cover',
  },
  conteudo: {
    paddingHorizontal: 76,
    marginTop: 56,
  },
  frase: {
    color: cores.branco,
    fontSize: 20,
    textAlign: 'center',
    marginVertical: 24,
  },
});
