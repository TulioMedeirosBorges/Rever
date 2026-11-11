import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { cores } from '../styles/tema';

export default function ItemHabito({ nome, icone, concluido, mostrarSeta, aoPressionar }) {
  return (
    <TouchableOpacity
      style={[styles.item, concluido && styles.itemConcluido]}
      onPress={aoPressionar}
    >
      <View style={[styles.caixa, concluido && styles.caixaMarcada]}>
        {concluido ? (
          <Image source={require('../assets/icones/check.png')} style={styles.check} />
        ) : null}
      </View>
      <Image source={icone} style={styles.icone} />
      <Text style={styles.nome}>{nome}</Text>
      {mostrarSeta ? (
        <Image source={require('../assets/icones/seta-direita.png')} style={styles.seta} />
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: cores.cartao,
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 50,
    marginBottom: 12,
  },
  itemConcluido: {
    backgroundColor: cores.cartaoDestaque,
  },
  caixa: {
    width: 28,
    height: 28,
    backgroundColor: cores.branco,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  caixaMarcada: {
    backgroundColor: cores.roxoEscuro,
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
