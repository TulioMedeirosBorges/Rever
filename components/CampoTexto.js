import { StyleSheet, TextInput, View } from 'react-native';
import IconePixel from './IconePixel';
import MolduraPixel from './MolduraPixel';
import { cores, fontes } from '../styles/tema';

export default function CampoTexto({ icone, ...propsDoInput }) {
  return (
    <MolduraPixel corFundo={cores.branco} corTopo={cores.cinzaClaro} style={styles.moldura}>
      <View style={styles.campo}>
        {icone ? <IconePixel nome={icone} tamanho={24} cor={cores.preto} /> : null}
        <TextInput
          style={styles.input}
          placeholderTextColor={cores.placeholder}
          selectionColor={cores.petroleo}
          {...propsDoInput}
        />
      </View>
    </MolduraPixel>
  );
}

const styles = StyleSheet.create({
  moldura: {
    marginVertical: 12,
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
    height: '100%',
    marginLeft: 10,
    paddingVertical: 0,
    fontFamily: fontes.regular,
    fontVariant: fontes.semLigaduras,
    fontSize: 19,
    color: cores.preto,
  },
});
