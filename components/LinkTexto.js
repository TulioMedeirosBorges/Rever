import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { cores } from '../styles/tema';

export default function LinkTexto({ texto, aoPressionar }) {
  return (
    <TouchableOpacity style={styles.area} onPress={aoPressionar}>
      <Text style={styles.texto}>{texto}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  area: {
    alignSelf: 'center',
    padding: 8,
  },
  texto: {
    color: cores.amarelo,
    fontSize: 14,
    fontWeight: 'bold',
  },
});
