import { Image, StyleSheet, Text, View } from 'react-native';
import Tela from '../components/Tela';
import Botao from '../components/Botao';
import { cores } from '../styles/tema';

const passos = [
  {
    imagem: require('../assets/imagens/onboarding-1.png'),
    largura: 260,
    titulo: 'Organize sua rotina.',
    texto: 'Pequenos hábitos,\ngrandes mudanças.',
    botao: 'Próximo',
    cor: cores.amarelo,
  },
  {
    imagem: require('../assets/imagens/onboarding-2.png'),
    largura: 300,
    titulo: 'Alcance seus objetivos',
    texto: 'Pequenos hábitos,\ngrandes mudanças.',
    botao: 'Próximo',
    cor: cores.arcoIris[3],
  },
  {
    imagem: require('../assets/imagens/onboarding-3.png'),
    largura: 280,
    titulo: 'Evolua todos os dias',
    texto: 'veja seu progresso e\nconquiste recompensas',
    botao: 'Cadastrar',
    cor: cores.arcoIris[4],
  },
];

export default function Onboarding({ route }) {
  const indice = route.params?.passo ?? 0;
  const { imagem, largura, titulo, texto, botao, cor } = passos[indice];

  return (
    <Tela>
      <Image source={imagem} style={[styles.imagem, { width: largura }]} />
      <View style={styles.conteudo}>
        <Text style={styles.titulo}>{titulo}</Text>
        <Text style={styles.texto}>{texto}</Text>
        <Botao texto={botao} />
        <View style={styles.pontos}>
          {passos.map((passo, i) => (
            <View
              key={passo.titulo}
              style={[styles.ponto, i === indice && { backgroundColor: cor }]}
            />
          ))}
        </View>
      </View>
    </Tela>
  );
}

const styles = StyleSheet.create({
  imagem: {
    height: 370,
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  conteudo: {
    paddingHorizontal: 76,
  },
  titulo: {
    color: cores.branco,
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 40,
  },
  texto: {
    color: cores.branco,
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 24,
  },
  pontos: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32,
  },
  ponto: {
    width: 16,
    height: 16,
    borderRadius: 3,
    backgroundColor: cores.branco,
    marginHorizontal: 8,
  },
});
