import { Image, StyleSheet, View } from 'react-native';
import TelaApresentacao from '../components/TelaApresentacao';
import LinkTexto from '../components/LinkTexto';
import { cores } from '../styles/tema';

const faixas = [...cores.arcoIris].reverse();

const TOPO_ARTE = 95;
const TOPO_FAIXAS = 220;
const ALTURA_FAIXA = 20;

export default function Splash({ navigation }) {
  return (
    <TelaApresentacao
      arte={(escala) => (
        <>
          <View style={[styles.faixas, { top: TOPO_FAIXAS * escala }]}>
            {faixas.map((cor) => (
              <View key={cor} style={{ height: ALTURA_FAIXA * escala, backgroundColor: cor }} />
            ))}
          </View>
          <Image
            source={require('../assets/imagens/splash-r.png')}
            style={{ marginTop: TOPO_ARTE * escala, width: 390 * escala, height: 275 * escala }}
          />
        </>
      )}
      texto={'Pequenos hábitos,\ngrandes mudanças.'}
      textoBotao="Começar"
      aoPressionar={() => navigation.navigate('Onboarding', { passo: 0 })}
      rodape={
        <LinkTexto texto="Entrar" tamanho={20} aoPressionar={() => navigation.navigate('Login')} />
      }
    />
  );
}

const styles = StyleSheet.create({
  faixas: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
});
