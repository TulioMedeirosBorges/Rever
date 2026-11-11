import { Image, StyleSheet, View } from 'react-native';
import TelaApresentacao, { ALTURA_ARTE } from '../components/TelaApresentacao';
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
    titulo: 'Alcance seus objetivos.',
    texto: 'Pequenos hábitos,\ngrandes mudanças.',
    botao: 'Próximo',
    cor: cores.turquesa,
  },
  {
    imagem: require('../assets/imagens/onboarding-3.png'),
    largura: 280,
    titulo: 'Evolua todos os dias.',
    texto: 'Veja seu progresso e\nconquiste recompensas.',
    botao: 'Cadastrar',
    cor: cores.laranja,
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
    <TelaApresentacao
      arte={(escala) => (
        <Image source={imagem} style={{ width: largura * escala, height: ALTURA_ARTE * escala }} />
      )}
      titulo={titulo}
      texto={texto}
      textoBotao={botao}
      aoPressionar={avancar}
      rodape={
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
      }
    />
  );
}

const styles = StyleSheet.create({
  pontos: {
    flexDirection: 'row',
  },
  ponto: {
    width: 16,
    height: 16,
    marginHorizontal: 8,
  },
});
