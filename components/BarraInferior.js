import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import IconeProprio from './IconeProprio';
import FaixaArcoIris from './FaixaArcoIris';
import CantosPixel from './CantosPixel';
import { cores, fontes } from '../styles/tema';

const abas = [
  { nome: 'Inicio', rotulo: 'Início', icone: 'casa', cor: cores.arcoIris[0] },
  { nome: 'Agenda', rotulo: 'Agenda', icone: 'calendario', cor: cores.arcoIris[1] },
  { nome: 'CriarHabito', rotulo: '', icone: 'mais', cor: cores.branco },
  { nome: 'Progresso', rotulo: 'Progresso', icone: 'trofeu', cor: cores.arcoIris[3] },
  { nome: 'Perfil', rotulo: 'Perfil', icone: 'usuario', cor: cores.roxo },
];

export default function BarraInferior({ abaAtiva }) {
  const navigation = useNavigation();
  const { bottom } = useSafeAreaInsets();

  const selecionar = (nome) => {
    if (nome === abaAtiva) {
      return;
    }
    if (nome === 'CriarHabito') {
      navigation.navigate('CriarHabito');
    } else {
      navigation.replace(nome);
    }
  };

  return (
    <View>
      <FaixaArcoIris altura={8} />
      <View style={[styles.barra, { paddingBottom: 10 + bottom }]}>
        {abas.map(({ nome, rotulo, icone, cor }) => {
          const ativa = nome === abaAtiva;
          const corAtual = ativa ? cor : cores.branco;

          return (
            <TouchableOpacity
              key={nome}
              style={styles.aba}
              onPress={() => selecionar(nome)}
              activeOpacity={0.7}
            >
              <IconeProprio nome={icone} tamanho={rotulo ? 30 : 44} cor={corAtual} />
              {rotulo ? <Text style={[styles.rotulo, { color: corAtual }]}>{rotulo}</Text> : null}
            </TouchableOpacity>
          );
        })}
      </View>
      <CantosPixel />
    </View>
  );
}

const styles = StyleSheet.create({
  barra: {
    flexDirection: 'row',
    backgroundColor: cores.botao,
    paddingTop: 14,
  },
  aba: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rotulo: {
    fontFamily: fontes.regular,
    fontVariant: fontes.semLigaduras,
    fontSize: 13,
    marginTop: 4,
  },
});
