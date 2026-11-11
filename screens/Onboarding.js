import { Image, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Tela from '../components/Tela';
import Botao from '../components/Botao';
import MolduraPixel from '../components/MolduraPixel';
import { cores, fontes } from '../styles/tema';

const ALTURA_ARTE = 390;

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
    titulo: 'Alcance seus objetivos.',
    texto: 'Pequenos hábitos,\ngrandes mudanças.',
    botao: 'Próximo',
    cor: cores.arcoIris[3],
  },
  {
    imagem: require('../assets/imagens/onboarding-3.png'),
    largura: 280,
    titulo: 'Evolua todos os dias.',
    texto: 'Veja seu progresso e\nconquiste recompensas.',
    botao: 'Cadastrar',
    cor: cores.arcoIris[4],
  },
];

export default function Onboarding({ navigation, route }) {
  const indice = route.params?.passo ?? 0;
  const { imagem, largura, titulo, texto, botao, cor } = passos[indice];
  const ultimoPasso = indice === passos.length - 1;

  const { height: alturaTela } = useWindowDimensions();
  const alturaArte = Math.min(ALTURA_ARTE, alturaTela * 0.47);
  const larguraArte = (largura / ALTURA_ARTE) * alturaArte;

  const avancar = () => {
    if (ultimoPasso) {
      navigation.navigate('Cadastro');
    } else {
      navigation.push('Onboarding', { passo: indice + 1 });
    }
  };

  return (
    <Tela bordas={['bottom']}>
      <Image
        source={imagem}
        style={[styles.imagem, { width: larguraArte, height: alturaArte }]}
      />
      <View style={styles.conteudo}>
        <Text style={styles.titulo}>{titulo}</Text>
        <Text style={styles.texto}>{texto}</Text>
        <View style={styles.botao}>
          <Botao texto={botao} aoPressionar={avancar} />
        </View>
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
    alignSelf: 'center',
  },
  conteudo: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingTop: 8,
    paddingBottom: 48,
  },
  botao: {
    paddingHorizontal: 48,
  },
  titulo: {
    color: cores.branco,
    fontSize: 38,
    fontFamily: fontes.negrito,
    fontVariant: fontes.semLigaduras,
    lineHeight: 44,
    textAlign: 'center',
  },
  texto: {
    color: cores.branco,
    fontFamily: fontes.regular,
    fontVariant: fontes.semLigaduras,
    fontSize: 23,
    lineHeight: 29,
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
