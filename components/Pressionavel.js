import { useRef } from 'react';
import { Animated, Pressable } from 'react-native';
import { vibracoes } from '../utils/tato';

const PressableAnimado = Animated.createAnimatedComponent(Pressable);

export default function Pressionavel({
  aoPressionar,
  vibracaoApertar = 'apertarLeve',
  vibracaoSoltar = 'soltar',
  escala = 0.94,
  afundar = 0,
  style,
  children,
  disabled,
  ...props
}) {
  const pressao = useRef(new Animated.Value(0)).current;

  const apertar = () => {
    vibracoes[vibracaoApertar]?.();
    Animated.timing(pressao, {
      toValue: 1,
      duration: 70,
      useNativeDriver: true,
    }).start();
  };

  const soltar = () => {
    vibracoes[vibracaoSoltar]?.();
    Animated.spring(pressao, {
      toValue: 0,
      friction: 4,
      tension: 220,
      useNativeDriver: true,
    }).start();
  };

  const transform = [
    { scale: pressao.interpolate({ inputRange: [0, 1], outputRange: [1, escala] }) },
    { translateY: pressao.interpolate({ inputRange: [0, 1], outputRange: [0, afundar] }) },
  ];

  return (
    <PressableAnimado
      {...props}
      disabled={disabled}
      onPress={aoPressionar}
      onPressIn={apertar}
      onPressOut={soltar}
      style={[style, { transform }]}
    >
      {children}
    </PressableAnimado>
  );
}
