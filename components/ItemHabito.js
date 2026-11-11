import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MolduraPixel from './MolduraPixel';
import { cores } from '../styles/tema';

export default function ItemHabito({ nome, icone, concluido, mostrarSeta, aoPressionar }) {
  return (
    <TouchableOpacity style={styles.toque} onPress={aoPressionar}>
      <MolduraPixel corFundo={concluido ? cores.cartaoDestaque : cores.cartao} pixel={3}>
        <View style={styles.item}>
          <MolduraPixel
            corFundo={concluido ? cores.roxoEscuro : cores.branco}
            pixel={3}
            degraus={1}
            style={styles.caixa}
          >
            {concluido ? (
              <Image source={require('../assets/icones/check.png')} style={styles.check} />
            ) : null}
          </MolduraPixel>
          <Image source={icone} style={styles.icone} />
          <Text style={styles.nome}>{nome}</Text>
          {mostrarSeta ? (
            <Image source={require('../assets/icones/seta-direita.png')} style={styles.seta} />
          ) : null}
        </View>
      </MolduraPixel>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  toque: {
    marginBottom: 12,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    height: 50,
  },
  caixa: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  check: {
    width: 18,
    height: 18,
    tintColor: cores.branco,
  },
  icone: {
    width: 24,
    height: 24,
    marginLeft: 14,
    tintColor: cores.branco,
  },
  nome: {
    flex: 1,
    color: cores.branco,
    fontSize: 18,
    marginLeft: 12,
  },
  seta: {
    width: 24,
    height: 24,
    tintColor: cores.branco,
  },
});
