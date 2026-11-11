import { useEffect, useRef, useState } from 'react';
import { Animated, Image, StyleSheet, useWindowDimensions, View } from 'react-native';
import TelaApresentacao from '../components/TelaApresentacao';
import LinkTexto from '../components/LinkTexto';
import LogoAnimada, { DURACAO_LOGO } from '../components/LogoAnimada';
import { cores } from '../styles/tema';
import { molas } from '../utils/movimento';
import { tocar } from '../utils/sons';

const faixas = [...cores.arcoIris].reverse();

const TOPO_ARTE = 95;
const TOPO_FAIXAS = 220;
const ALTURA_FAIXA = 20;

// Abertura (≈2,7 s): a cortina "pinta" a arte da esquerda para a direita, a arte dá um quique,
// a logo se monta (rastro, letras, estrelinhas, ola) e só então o texto e os botões entram.
const QUIQUE = 320;
const INICIO_LOGO = 650;
const CONTEUDO = INICIO_LOGO + DURACAO_LOGO - 300;

export default function Splash({ navigation }) {
  const { width: largura } = useWindowDimensions();
  const cortina = useRef(new Animated.Value(0)).current;
  const quique = useRef(new Animated.Value(0)).current;
  const [pintado, setPintado] = useState(false);

  useEffect(() => {
    const abertura = Animated.parallel([
      Animated.spring(cortina, {
        toValue: 1,
        useNativeDriver: true,
        friction: 16,
        tension: 30,
      }),
      Animated.sequence([
        Animated.delay(QUIQUE),
        Animated.spring(quique, { toValue: 1, useNativeDriver: true, ...molas.quique }),
      ]),
    ]);
    abertura.start(() => setPintado(true));
    const sino = setTimeout(() => tocar('focoInicio'), QUIQUE + 60);
    // Garantia: a cortina nunca fica parada na frente da arte.
    const seguranca = setTimeout(() => setPintado(true), 2200);

    return () => {
      abertura.stop();
      clearTimeout(sino);
      clearTimeout(seguranca);
    };
  }, [cortina, quique]);

  const escalaArte = quique.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1] });
  const deslocamento = cortina.interpolate({ inputRange: [0, 1], outputRange: [0, largura] });

  return (
    <TelaApresentacao
      atrasoConteudo={CONTEUDO}
      logo={<LogoAnimada atraso={INICIO_LOGO} />}
      arte={(escala) => (
        <>
          <Animated.View style={[styles.arte, { transform: [{ scale: escalaArte }] }]}>
            <View style={[styles.faixas, { top: TOPO_FAIXAS * escala }]}>
              {faixas.map((cor) => (
                <View key={cor} style={{ height: ALTURA_FAIXA * escala, backgroundColor: cor }} />
              ))}
            </View>
            <Image
              source={require('../assets/imagens/splash-r.png')}
              style={{ marginTop: TOPO_ARTE * escala, width: 390 * escala, height: 275 * escala }}
            />
          </Animated.View>
          {pintado ? null : (
            <Animated.View
              pointerEvents="none"
              style={[styles.cortina, { transform: [{ translateX: deslocamento }] }]}
            >
              <View style={styles.borda} />
            </Animated.View>
          )}
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
  arte: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: 'center',
  },
  faixas: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  cortina: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: cores.fundo,
  },
  // Borda pixelada creme na frente da cortina, como um pincel passando.
  borda: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: 6,
    backgroundColor: cores.creme,
  },
});
