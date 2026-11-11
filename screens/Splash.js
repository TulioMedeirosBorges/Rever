import { Image, StyleSheet, Text, View } from 'react-native';
import Tela from '../components/Tela';
import Logo from '../components/Logo';
import Botao from '../components/Botao';
import LinkTexto from '../components/LinkTexto';
import { cores, fontes } from '../styles/tema';

const faixas = [...cores.arcoIris].reverse();

export default function Splash({ navigation }) {
  return (
    <Tela bordas={['bottom']} style={styles.tela}>
      <View style={styles.arte}>
        <View style={styles.faixas}>
          {faixas.map((cor) => (
            <View key={cor} style={[styles.faixa, { backgroundColor: cor }]} />
          ))}
        </View>
        <Image source={require('../assets/imagens/splash-r.png')} style={styles.imagem} />
      </View>

      <View style={styles.conteudo}>
        <Logo />
        <Text style={styles.frase}>Pequenos hábitos,{'\n'}grandes mudanças.</Text>
        <Botao
          texto="Começar"
          aoPressionar={() => navigation.navigate('Onboarding', { passo: 0 })}
        />
        <LinkTexto
          texto="Entrar"
          tamanho={20}
          aoPressionar={() => navigation.navigate('Login')}
        />
      </View>
    </Tela>
  );
}

const styles = StyleSheet.create({
  tela: {
    justifyContent: 'center',
  },
  arte: {
    height: 275,
    alignItems: 'center',
    overflow: 'hidden',
  },
  faixas: {
    position: 'absolute',
    top: 125,
    left: 0,
    right: 0,
  },
  faixa: {
    height: 20,
  },
  imagem: {
    width: 390,
    height: 275,
  },
  conteudo: {
    width: 238,
    alignSelf: 'center',
    marginTop: 60,
    marginBottom: 60,
  },
  frase: {
    color: cores.branco,
    fontFamily: fontes.regular,
    fontVariant: fontes.semLigaduras,
    fontSize: 24,
    lineHeight: 29,
    textAlign: 'center',
    marginVertical: 24,
  },
});
