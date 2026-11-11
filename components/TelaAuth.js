import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Tela from './Tela';
import FaixaArcoIris from './FaixaArcoIris';
import LogoAnimada from './LogoAnimada';
import { cores, fontes } from '../styles/tema';

export default function TelaAuth({ titulo, subtitulo, children }) {
  return (
    <Tela>
      <ScrollView
        contentContainerStyle={styles.conteudo}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets
      >
        <View style={styles.coluna}>
          <FaixaArcoIris altura={6} />
          <View style={styles.logo}>
            <LogoAnimada atraso={150} som={false} />
          </View>
          <Text style={styles.titulo}>{titulo}</Text>
          <Text style={styles.subtitulo}>{subtitulo}</Text>
          {children}
        </View>
      </ScrollView>
    </Tela>
  );
}

const styles = StyleSheet.create({
  conteudo: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  coluna: {
    width: '100%',
    maxWidth: 286,
    alignSelf: 'center',
  },
  logo: {
    marginTop: 34,
    marginBottom: 8,
  },
  titulo: {
    color: cores.branco,
    fontFamily: fontes.negrito,
    fontVariant: fontes.semLigaduras,
    fontSize: 25,
    textAlign: 'center',
  },
  subtitulo: {
    color: cores.branco,
    fontFamily: fontes.regular,
    fontVariant: fontes.semLigaduras,
    fontSize: 19,
    lineHeight: 24,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 26,
  },
});
