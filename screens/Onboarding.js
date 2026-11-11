import { Image, StyleSheet, Text, View } from 'react-native';
import Tela from '../components/Tela';
import Botao from '../components/Botao';
import MolduraPixel from '../components/MolduraPixel';
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

export default function Onboarding({ navigation, route }) {
  const indice = route.params?.passo ?? 0;
  const { imagem, largura, titulo, texto, botao, cor } = passos[indice];
  const ultimoPasso = indice === passos.length - 1;

  const avancar = () => {
    if (ultimoPasso) {
      navigation.navigate('Cadastro');
    } else {
      navigation.push('Onboarding', { passo: indice + 1 });
    }
  };

  return (
    <Tela>
      <Image source={imagem} style={[styles.imagem, { width: largura }]} />
      <View style={styles.conteudo}>
        <Text style={styles.titulo}>{titulo}</Text>
        <Text style={styles.texto}>{texto}</Text>
        <Botao texto={botao} aoPressionar={avancar} />
        <View style={styles.pontos}>
          {passos.map((passo, i) => (
            <MolduraPixel
              key={passo.titulo}
              corFundo={i === indice ? cor : cores.branco}
              pixel={2}
              degraus={1}
              style={styles.ponto}
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
    marginHorizontal: 8,
  },
});
