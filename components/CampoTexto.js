import { StyleSheet, TextInput, View } from 'react-native';
import IconePixel from './IconePixel';
import MolduraPixel from './MolduraPixel';
import { cores } from '../styles/tema';

export default function CampoTexto({ icone, placeholder, value, onChangeText, secureTextEntry }) {
  return (
    <MolduraPixel corFundo={cores.branco} corTopo={cores.cinzaClaro} style={styles.moldura}>
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
    </MolduraPixel>
  );
}

const styles = StyleSheet.create({
  moldura: {
    marginVertical: 10,
  },
  campo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 4,
    height: 50,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: cores.preto,
  },
});
