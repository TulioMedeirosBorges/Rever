import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MolduraPixel from './MolduraPixel';
import { cores, fontes } from '../styles/tema';
import { tocar } from '../utils/sons';

const VELOCIDADE = 28;
const silabas = ['reviFala1', 'reviFala2', 'reviFala3'];

// Balão de fala em pixel art. O texto aparece letra por letra, como em jogo antigo;
// com `falando`, cada sílaba faz um "bip" de voz.
export default function BalaoFala({ texto, falando = false, tamanho = 15 }) {
  const [mostradas, setMostradas] = useState(0);

  useEffect(() => {
    let letras = 0;
    setMostradas(0);
    const maquina = setInterval(() => {
      letras += 1;
      setMostradas(letras);
      const letra = texto[letras - 1];
      // Começa a "falar" depois do pio de reação do Revi.
      if (falando && letras > 6 && letras % 3 === 1 && letra && letra !== ' ') {
        tocar(silabas[letras % silabas.length]);
      }
      if (letras >= texto.length) {
        clearInterval(maquina);
      }
    }, VELOCIDADE);
    return () => clearInterval(maquina);
  }, [texto, falando]);

  return (
    <View style={styles.area}>
      <View style={styles.rabicho} pointerEvents="none">
        <View style={[styles.degrau, styles.degrauMaior]} />
        <View style={[styles.degrau, styles.degrauMenor]} />
      </View>
      <MolduraPixel corFundo={cores.creme} corTopo={cores.branco} pixel={3}>
        <Text style={[styles.texto, { fontSize: tamanho }]} accessibilityLabel={texto}>
          {texto.slice(0, mostradas)}
          <Text style={styles.oculto}>{texto.slice(mostradas)}</Text>
        </Text>
      </MolduraPixel>
    </View>
  );
}

const styles = StyleSheet.create({
  area: {
    flex: 1,
    marginLeft: 12,
  },
  rabicho: {
    position: 'absolute',
    left: -9,
    top: 16,
    width: 9,
    height: 12,
  },
  degrau: {
    position: 'absolute',
    backgroundColor: cores.creme,
  },
  degrauMaior: {
    right: 0,
    top: 0,
    width: 6,
    height: 12,
  },
  degrauMenor: {
    right: 6,
    top: 3,
    width: 3,
    height: 6,
  },
  texto: {
    color: cores.preto,
    fontFamily: fontes.media,
    fontVariant: fontes.semLigaduras,
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 9,
  },
  oculto: {
    color: 'transparent',
  },
});
