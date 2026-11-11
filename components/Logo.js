import { Image, StyleSheet } from 'react-native';

export default function Logo() {
  return <Image source={require('../assets/imagens/logo.png')} style={styles.logo} />;
}

const styles = StyleSheet.create({
  logo: {
    width: 143,
    height: 46,
    alignSelf: 'center',
  },
});
