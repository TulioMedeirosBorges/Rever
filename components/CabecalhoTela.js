import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import FaixaArcoIris from './FaixaArcoIris';
import { cores } from '../styles/tema';

export default function CabecalhoTela({ titulo, mostrarVoltar, aoVoltar }) {
  return (
    <View style={styles.container}>
      <View style={styles.linha}>
        {mostrarVoltar ? (
          <TouchableOpacity onPress={aoVoltar} style={styles.voltar}>
            <MaterialCommunityIcons name="chevron-left" size={32} color={cores.branco} />
          </TouchableOpacity>
        ) : null}
        <Text style={[styles.titulo, mostrarVoltar && styles.tituloCentro]}>{titulo}</Text>
      </View>
      <FaixaArcoIris />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  voltar: {
    position: 'absolute',
    left: -8,
    zIndex: 1,
  },
  titulo: {
    color: cores.branco,
    fontSize: 26,
    fontWeight: 'bold',
  },
  tituloCentro: {
    flex: 1,
    textAlign: 'center',
  },
});
