import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { cores } from '../styles/tema';

export default function Tela({ children, style, bordas = ['top', 'bottom'] }) {
  return (
    <SafeAreaView edges={bordas} style={[styles.tela, style]}>
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
});
