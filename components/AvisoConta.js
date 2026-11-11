import { StyleSheet, Text, View } from 'react-native';
import MolduraPixel from './MolduraPixel';
import IconePixel from './IconePixel';
import { cores, fontes } from '../styles/tema';

export function ErroFormulario({ texto }) {
  return texto ? <Text style={styles.erro}>{texto}</Text> : null;
}

// Lembra que a conta e as conversas ficam só neste celular.
export function NotaPrivacidade() {
  return (
    <MolduraPixel corFundo={cores.cartao} pixel={3} style={styles.nota}>
      <View style={styles.linha}>
        <IconePixel nome="lock" tamanho={18} cor={cores.turquesa} />
        <Text style={styles.texto}>
          Sua conta, seus hábitos e suas conversas ficam salvos só neste celular. Nada vai para um
          banco de dados.
        </Text>
      </View>
    </MolduraPixel>
  );
}

const styles = StyleSheet.create({
  erro: {
    color: cores.perigo,
    fontFamily: fontes.media,
    fontVariant: fontes.semLigaduras,
    fontSize: 15,
    textAlign: 'center',
    marginTop: 4,
  },
  nota: {
    marginTop: 14,
    marginBottom: 6,
  },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
  },
  texto: {
    flex: 1,
    color: cores.cinzaClaro,
    fontFamily: fontes.regular,
    fontVariant: fontes.semLigaduras,
    fontSize: 12,
    lineHeight: 17,
  },
});
