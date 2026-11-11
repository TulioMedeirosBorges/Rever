import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { molas, naBatida } from '../utils/movimento';

// Cada tipo chega de um jeito; a opacidade só acompanha o movimento (nada entra só com fade).
const movimentos = {
  subir: (p) => [{ translateY: p.interpolate({ inputRange: [0, 1], outputRange: [28, 0] }) }],
  cair: (p) => [{ translateY: p.interpolate({ inputRange: [0, 1], outputRange: [-36, 0] }) }],
  esquerda: (p) => [{ translateX: p.interpolate({ inputRange: [0, 1], outputRange: [-40, 0] }) }],
  direita: (p) => [{ translateX: p.interpolate({ inputRange: [0, 1], outputRange: [40, 0] }) }],
  escala: (p) => [{ scale: p.interpolate({ inputRange: [0, 1], outputRange: [0.82, 1] }) }],
  // Barras de gráfico crescem a partir da base.
  crescer: (p) => [{ scaleY: p }],
};

export default function Entrada({
  children,
  ordem = 0,
  tipo = 'subir',
  mola = 'viva',
  atraso = 0,
  style,
}) {
  const progresso = useRef(new Animated.Value(0)).current;
  // Com a barra fixa, a transição entre abas é dos elementos: toda vez que a tela
  // volta a ficar em foco, eles entram de novo (sem recarregar a tela nem perder estado).
  const emFoco = useIsFocused();

  useEffect(() => {
    if (!emFoco) {
      return undefined;
    }
    progresso.setValue(0);
    const animacao = Animated.spring(progresso, {
      toValue: 1,
      delay: atraso + naBatida(ordem),
      useNativeDriver: true,
      ...molas[mola],
    });
    animacao.start();
    return () => animacao.stop();
  }, [emFoco, progresso, ordem, atraso, mola]);

  const opacity = progresso.interpolate({
    inputRange: [0, 0.35, 1],
    outputRange: [0, 1, 1],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View
      style={[
        style,
        tipo === 'crescer' && { transformOrigin: 'bottom' },
        { opacity, transform: movimentos[tipo](progresso) },
      ]}
    >
      {children}
    </Animated.View>
  );
}
