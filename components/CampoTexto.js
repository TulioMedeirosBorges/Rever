import { StyleSheet, TextInput, View } from 'react-native';
import IconePixel from './IconePixel';
import { cores } from '../styles/tema';

export default function CampoTexto({ icone, placeholder, value, onChangeText, secureTextEntry }) {
  return (
    <View style={styles.campo}>
      {icone ? <IconePixel nome={icone} tamanho={22} cor={cores.preto} /> : null}
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={cores.preto}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  campo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: cores.branco,
    borderTopWidth: 4,
    borderTopColor: '#c8c8d0',
    borderRadius: 4,
    paddingHorizontal: 16,
    height: 50,
    marginVertical: 10,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: cores.preto,
  },
});
