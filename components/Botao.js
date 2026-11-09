import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function Botao({ texto, aoPressionar }) {
  return (
    <TouchableOpacity style={styles.botao} onPress={aoPressionar}>
      <Text style={styles.texto}>{texto}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  botao: {
    backgroundColor: '#4a6cf7',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 8,
  },
  texto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
