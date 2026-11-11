import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { cores } from '../styles/tema';

// Gerador com semente fixa: o céu é sempre o mesmo em todas as telas.
const sorteador = (semente) => {
  let valor = semente;
  return () => {
    valor = (valor * 16807) % 2147483647;
    return (valor - 1) / 2147483646;
  };
};

const sortear = sorteador(42);
const coresEstrela = [cores.creme, cores.creme, cores.turquesa, cores.amarelo, cores.cinza];

const estrelas = Array.from({ length: 26 }, (_, indice) => ({
  chave: `estrela-${indice}`,
  left: `${(sortear() * 96).toFixed(1)}%`,
  top: `${(sortear() * 92).toFixed(1)}%`,
  lado: sortear() < 0.7 ? 2 : 3,
  cor: coresEstrela[Math.floor(sortear() * coresEstrela.length)],
  opacidade: 0.25 + sortear() * 0.35,
}));

// Estrelas maiores, no formato da estrela da logo, que piscam em tempos diferentes.
// Ficam só nas margens laterais para nunca encostar em texto ou botões.
const brilhos = Array.from({ length: 6 }, (_, indice) => ({
  chave: `brilho-${indice}`,
  left: `${(indice % 2 === 0 ? 0.6 + sortear() * 1.2 : 96.9 + sortear() * 0.4).toFixed(1)}%`,
  top: `${(8 + sortear() * 78).toFixed(1)}%`,
  cor: indice % 2 === 0 ? cores.creme : cores.amarelo,
  fase: indice / 6,
}));

// Faixas do topo: degraus de cor, como céu de jogo antigo.
const faixas = ['#232036', '#211e32', '#1f1c2e', '#1d1b2a', '#1b1926', '#1a1824'];

// Morros ao fundo: [esquerda %, largura %, altura px].
const morros = [
  [0, 22, 46],
  [16, 18, 70],
  [30, 26, 38],
  [52, 16, 58],
  [64, 24, 84],
  [84, 16, 50],
];

function Brilho({ left, top, cor, fase, relogio }) {
  const opacity = relogio.interpolate({
    inputRange: [0, fase, Math.min(fase + 0.12, 0.99), Math.min(fase + 0.24, 1), 1],
    outputRange: [0.15, 0.15, 0.9, 0.15, 0.15],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View style={[styles.brilho, { left, top, opacity }]}>
      <View style={[styles.brilhoVertical, { backgroundColor: cor }]} />
      <View style={[styles.brilhoHorizontal, { backgroundColor: cor }]} />
    </Animated.View>
  );
}

export default function FundoPixel() {
  const relogio = useRef(new Animated.Value(0)).current;

  // Um único relógio anima todos os brilhos; para quando a tela sai.
  useEffect(() => {
    const animacao = Animated.loop(
      Animated.timing(relogio, { toValue: 1, duration: 5200, useNativeDriver: true }),
    );
    animacao.start();
    return () => animacao.stop();
  }, [relogio]);

  return (
    <View style={styles.camada} pointerEvents="none">
      <View>
        {faixas.map((cor, indice) => (
          <View key={cor} style={{ height: 14 + indice * 6, backgroundColor: cor }} />
        ))}
      </View>

      {estrelas.map(({ chave, left, top, lado, cor, opacidade }) => (
        <View
          key={chave}
          style={[
            styles.estrela,
            { left, top, width: lado, height: lado, backgroundColor: cor, opacity: opacidade },
          ]}
        />
      ))}

      {brilhos.map(({ chave, ...brilho }) => (
        <Brilho key={chave} {...brilho} relogio={relogio} />
      ))}

      {morros.map(([esquerda, largura, altura]) => (
        <View
          key={`morro-${esquerda}`}
          style={[styles.morro, { left: `${esquerda}%`, width: `${largura}%`, height: altura }]}
        >
          <View style={styles.cumeMorro} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  camada: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    overflow: 'hidden',
  },
  estrela: {
    position: 'absolute',
  },
  brilho: {
    position: 'absolute',
    width: 9,
    height: 9,
  },
  brilhoVertical: {
    position: 'absolute',
    left: 3,
    top: 0,
    width: 3,
    height: 9,
  },
  brilhoHorizontal: {
    position: 'absolute',
    left: 0,
    top: 3,
    width: 9,
    height: 3,
  },
  morro: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#1c1a28',
  },
  cumeMorro: {
    position: 'absolute',
    top: -6,
    left: '20%',
    right: '20%',
    height: 6,
    backgroundColor: '#1c1a28',
  },
});
