import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MolduraPixel from './MolduraPixel';
import IconePixel from './IconePixel';
import { useHabitos } from '../contexto/HabitosContexto';
import { cores, fontes } from '../styles/tema';
import { sucesso } from '../utils/tato';
import { tocar } from '../utils/sons';

const DURACAO = 3200;

// Faixa que desce do topo quando uma conquista é desbloqueada.
export default function AvisoConquista() {
  const { aviso, dispensarAviso } = useHabitos();
  const { top } = useSafeAreaInsets();
  const entrada = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!aviso) {
      return undefined;
    }
    sucesso();
    tocar(aviso.tipo === 'nivel' ? 'nivel' : 'conquista');
    entrada.setValue(0);
    Animated.spring(entrada, {
      toValue: 1,
      friction: 6,
      tension: 80,
      useNativeDriver: true,
    }).start();

    const tempo = setTimeout(() => {
      Animated.timing(entrada, { toValue: 0, duration: 220, useNativeDriver: true }).start(() =>
        dispensarAviso(),
      );
    }, DURACAO);

    return () => clearTimeout(tempo);
  }, [aviso, entrada, dispensarAviso]);

  if (!aviso) {
    return null;
  }

  const translateY = entrada.interpolate({ inputRange: [0, 1], outputRange: [-160, 0] });

  return (
    <Animated.View
      style={[styles.camada, { paddingTop: top + 8, transform: [{ translateY }] }]}
      pointerEvents="box-none"
    >
      <Pressable onPress={dispensarAviso} accessibilityRole="alert">
        <MolduraPixel corFundo={cores.cartaoDestaque} corTopo={aviso.cor} pixel={4}>
          <View style={styles.conteudo}>
            <MolduraPixel corFundo={cores.fundo} pixel={3} degraus={1} style={styles.selo}>
              <IconePixel nome={aviso.icone} tamanho={28} cor={aviso.cor} />
            </MolduraPixel>
            <View style={styles.textos}>
              <Text style={styles.titulo}>{aviso.titulo ?? 'Conquista desbloqueada!'}</Text>
              <Text style={styles.nome}>{aviso.nome}</Text>
            </View>
          </View>
        </MolduraPixel>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  camada: {
    position: 'absolute',
    top: 0,
    left: 16,
    right: 16,
  },
  conteudo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    paddingTop: 16,
  },
  selo: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textos: {
    flex: 1,
    marginLeft: 12,
  },
  titulo: {
    color: cores.amarelo,
    fontFamily: fontes.media,
    fontVariant: fontes.semLigaduras,
    fontSize: 13,
    textTransform: 'uppercase',
  },
  nome: {
    color: cores.branco,
    fontFamily: fontes.negrito,
    fontVariant: fontes.semLigaduras,
    fontSize: 20,
  },
});
