import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { molas } from '../utils/movimento';
import { tocar } from '../utils/sons';

// A logo separada em camadas do mesmo tamanho (a sobreposição é idêntica à logo original).
const camadas = {
  faixa: require('../assets/imagens/logo/faixa.png'),
  letras: [
    require('../assets/imagens/logo/letra-1.png'),
    require('../assets/imagens/logo/letra-2.png'),
    require('../assets/imagens/logo/letra-3.png'),
    require('../assets/imagens/logo/letra-4.png'),
    require('../assets/imagens/logo/letra-5.png'),
  ],
  brilhos: [
    require('../assets/imagens/logo/brilho-1.png'),
    require('../assets/imagens/logo/brilho-2.png'),
  ],
};

const LARGURA = 143;
const ALTURA = 46;

// Linha do tempo (ms, a partir do `atraso`):
const RISCO = 0; // o rastro de arco-íris dispara da esquerda
const LETRAS = 350; // as letras caem uma a uma, cada uma com uma nota
const ENTRE_LETRAS = 110;
const BRILHOS = LETRAS + 5 * ENTRE_LETRAS + 120; // as estrelinhas surgem girando
const ONDA = BRILHOS + 300; // as letras fazem uma "ola"

export const DURACAO_LOGO = ONDA + 5 * 60 + 300;

export default function LogoAnimada({ atraso = 0, som = true }) {
  const risco = useRef(new Animated.Value(0)).current;
  const letras = useRef(camadas.letras.map(() => new Animated.Value(0))).current;
  const ondas = useRef(camadas.letras.map(() => new Animated.Value(0))).current;
  const brilhos = useRef(camadas.brilhos.map(() => new Animated.Value(0))).current;
  const piscar = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const quando = (ms, animacao) => Animated.sequence([Animated.delay(atraso + ms), animacao]);
    const mola = (valor, tipo, extra = {}) =>
      Animated.spring(valor, { toValue: 1, useNativeDriver: true, ...molas[tipo], ...extra });
    // A "ola": cada letra sobe e volta.
    const pulo = (valor) =>
      Animated.sequence([
        Animated.timing(valor, { toValue: 1, duration: 110, useNativeDriver: true }),
        Animated.spring(valor, { toValue: 0, useNativeDriver: true, ...molas.quique }),
      ]);

    const entrada = Animated.parallel([
      quando(RISCO, mola(risco, 'viva')),
      ...letras.map((valor, i) => quando(LETRAS + i * ENTRE_LETRAS, mola(valor, 'quique'))),
      ...brilhos.map((valor, i) => quando(BRILHOS + i * 90, mola(valor, 'quique'))),
      ...ondas.map((valor, i) => quando(ONDA + i * 60, pulo(valor))),
    ]);

    // Depois de montada, as estrelinhas continuam piscando devagar.
    const brilhoContinuo = Animated.loop(
      Animated.sequence([
        Animated.timing(piscar, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(piscar, { toValue: 0, duration: 900, useNativeDriver: true }),
        Animated.delay(700),
      ]),
    );
    entrada.start(({ finished }) => {
      if (finished) {
        brilhoContinuo.start();
      }
    });

    const sons = som
      ? [
          [RISCO, 'logoRisco'],
          ...letras.map((_, i) => [LETRAS + i * ENTRE_LETRAS + 90, `logoLetra${i + 1}`]),
          [BRILHOS + 60, 'logoBrilho'],
        ].map(([ms, nome]) => setTimeout(() => tocar(nome), atraso + ms))
      : [];

    return () => {
      entrada.stop();
      brilhoContinuo.stop();
      sons.forEach(clearTimeout);
    };
  }, [atraso, som, risco, letras, ondas, brilhos, piscar]);

  const estiloRisco = {
    transformOrigin: '12% 50%',
    opacity: risco.interpolate({ inputRange: [0, 0.2, 1], outputRange: [0, 1, 1] }),
    transform: [
      { translateX: risco.interpolate({ inputRange: [0, 1], outputRange: [-LARGURA, 0] }) },
      { scaleX: risco.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1] }) },
    ],
  };

  // As letras amassam a partir da linha de base, onde "aterrissam".
  const estiloLetra = (valor, onda) => ({
    transformOrigin: '50% 84%',
    opacity: valor.interpolate({ inputRange: [0, 0.3, 1], outputRange: [0, 1, 1] }),
    transform: [
      {
        translateY: Animated.add(
          valor.interpolate({ inputRange: [0, 1], outputRange: [-34, 0] }),
          onda.interpolate({ inputRange: [0, 1], outputRange: [0, -5] }),
        ),
      },
      { scaleY: valor.interpolate({ inputRange: [0, 0.7, 1], outputRange: [1.25, 0.9, 1] }) },
    ],
  });

  // Cada estrelinha gira e pulsa em volta do próprio centro.
  const estiloBrilho = (valor, indice) => ({
    transformOrigin: indice === 0 ? '91.6% 38%' : '94.4% 62%',
    opacity: valor.interpolate({ inputRange: [0, 0.3, 1], outputRange: [0, 1, 1] }),
    transform: [
      {
        scale: Animated.multiply(
          valor,
          piscar.interpolate({
            inputRange: [0, 1],
            outputRange: indice === 0 ? [1, 0.7] : [1, 1.3],
          }),
        ),
      },
      { rotate: valor.interpolate({ inputRange: [0, 1], outputRange: ['-90deg', '0deg'] }) },
    ],
  });

  return (
    <View style={styles.logo} accessibilityRole="image" accessibilityLabel="Rever">
      <Animated.Image source={camadas.faixa} style={[styles.camada, estiloRisco]} />
      {camadas.letras.map((fonte, i) => (
        <Animated.Image
          key={`letra-${i}`}
          source={fonte}
          style={[styles.camada, estiloLetra(letras[i], ondas[i])]}
        />
      ))}
      {camadas.brilhos.map((fonte, i) => (
        <Animated.Image
          key={`brilho-${i}`}
          source={fonte}
          style={[styles.camada, estiloBrilho(brilhos[i], i)]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: LARGURA,
    height: ALTURA,
    alignSelf: 'center',
  },
  camada: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: LARGURA,
    height: ALTURA,
  },
});
