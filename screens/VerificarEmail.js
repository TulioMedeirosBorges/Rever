import { Image, StyleSheet, Text } from 'react-native';
import Tela from '../components/Tela';
import Botao from '../components/Botao';
import { cores } from '../styles/tema';

export default function VerificarEmail({ navigation }) {
  return (
    <Tela style={styles.tela}>
      <Image source={require('../assets/imagens/email.png')} style={styles.imagem} />
      <Text style={styles.titulo}>Verifique seu{'\n'}e-mail</Text>
      <Text style={styles.texto}>Enviamos um link para{'\n'}recuperar sua senha</Text>
      <Botao texto="Voltar para o login" aoPressionar={() => navigation.popTo('Login')} />
    </Tela>
  );
}

const styles = StyleSheet.create({
  tela: {
    justifyContent: 'center',
    paddingHorizontal: 66,
  },
  imagem: {
    width: 265,
    height: 210,
    alignSelf: 'center',
  },
  titulo: {
    color: cores.branco,
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 64,
  },
  texto: {
    color: cores.branco,
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 32,
  },
});
