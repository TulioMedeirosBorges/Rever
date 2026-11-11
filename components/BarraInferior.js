import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import IconeProprio from './IconeProprio';
import FaixaArcoIris from './FaixaArcoIris';
import { cores } from '../styles/tema';

const abas = [
  { nome: 'Inicio', rotulo: 'Início', icone: 'casa', cor: cores.arcoIris[0] },
  { nome: 'Agenda', rotulo: 'Agenda', icone: 'calendario', cor: cores.arcoIris[1] },
  { nome: 'CriarHabito', rotulo: '', icone: 'mais', cor: cores.branco },
  { nome: 'Progresso', rotulo: 'Progresso', icone: 'trofeu', cor: cores.arcoIris[3] },
  { nome: 'Perfil', rotulo: 'Perfil', icone: 'usuario', cor: cores.branco, desativada: true },
];

export default function BarraInferior({ abaAtiva }) {
  const navigation = useNavigation();

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
      <FaixaArcoIris altura={6} />
      <View style={styles.barra}>
        {abas.map(({ nome, rotulo, icone, cor, desativada }) => {
          const ativa = nome === abaAtiva;
          const corAtual = ativa ? cor : cores.branco;

          return (
            <TouchableOpacity
              key={nome}
              style={[styles.aba, desativada && styles.abaDesativada]}
              disabled={desativada}
              onPress={() => selecionar(nome)}
            >
              <IconeProprio nome={icone} tamanho={rotulo ? 32 : 44} cor={corAtual} />
              {rotulo ? <Text style={[styles.rotulo, { color: corAtual }]}>{rotulo}</Text> : null}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  barra: {
    flexDirection: 'row',
    backgroundColor: cores.botao,
    paddingTop: 10,
    paddingBottom: 18,
  },
  aba: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  abaDesativada: {
    opacity: 0.4,
  },
  rotulo: {
    fontSize: 11,
    marginTop: 2,
  },
});
