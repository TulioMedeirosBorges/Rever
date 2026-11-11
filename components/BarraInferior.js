import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import IconePixel from './IconePixel';
import MolduraPixel from './MolduraPixel';
import Pressionavel from './Pressionavel';
import FaixaArcoIris from './FaixaArcoIris';
import CantosPixel from './CantosPixel';
import { cores, fontes } from '../styles/tema';

const abas = [
  { nome: 'Inicio', rotulo: 'Início', icone: 'home', cor: cores.vermelho },
  { nome: 'Agenda', rotulo: 'Agenda', icone: 'calendar-2', cor: cores.laranja },
  { nome: 'CriarHabito' },
  { nome: 'Progresso', rotulo: 'Progresso', icone: 'chart', cor: cores.amarelo },
  { nome: 'Perfil', rotulo: 'Perfil', icone: 'user', cor: cores.turquesa },
];

const ALTURA_BASE = 4;

export default function BarraInferior({ abaAtiva }) {
  const navigation = useNavigation();
  const { bottom } = useSafeAreaInsets();

  const selecionar = (nome) => {
    if (nome !== abaAtiva) {
      navigation.replace(nome);
    }
  };

  return (
    <View>
      <FaixaArcoIris altura={6} />
      <View style={[styles.barra, { paddingBottom: 8 + bottom }]}>
        {abas.map(({ nome, rotulo, icone, cor }) => {
          if (nome === 'CriarHabito') {
            return (
              <View key={nome} style={styles.aba}>
                <View style={styles.mais}>
                  <MolduraPixel corFundo="#a8916a" pixel={3} style={styles.baseMais} />
                  <Pressionavel
                    aoPressionar={() => navigation.navigate('CriarHabito')}
                    vibracaoApertar="apertar"
                    escala={1}
                    afundar={ALTURA_BASE}
                    accessibilityRole="button"
                    accessibilityLabel="Criar hábito"
                  >
                    <MolduraPixel corFundo={cores.principal} pixel={3} style={styles.botaoMais}>
                      <IconePixel nome="plus" tamanho={30} cor={cores.preto} />
                    </MolduraPixel>
                  </Pressionavel>
                </View>
              </View>
            );
          }

          const ativa = nome === abaAtiva;
          const corAtual = ativa ? cor : cores.cinza;

          return (
            <Pressionavel
              key={nome}
              style={styles.aba}
              aoPressionar={() => selecionar(nome)}
              escala={0.86}
              vibracaoSoltar="selecao"
              som="navegar"
              accessibilityRole="tab"
              accessibilityState={{ selected: ativa }}
            >
              <View style={[styles.indicador, ativa && { backgroundColor: cor }]} />
              <IconePixel nome={icone} tamanho={28} cor={corAtual} />
              <Text style={[styles.rotulo, { color: corAtual }]}>{rotulo}</Text>
            </Pressionavel>
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
    backgroundColor: cores.barra,
    paddingTop: 6,
  },
  aba: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicador: {
    width: 22,
    height: 4,
    marginBottom: 6,
  },
  rotulo: {
    fontFamily: fontes.media,
    fontVariant: fontes.semLigaduras,
    fontSize: 12,
    marginTop: 3,
  },
  mais: {
    paddingBottom: ALTURA_BASE,
    marginTop: 4,
  },
  baseMais: {
    position: 'absolute',
    top: ALTURA_BASE,
    bottom: 0,
    left: 0,
    right: 0,
  },
  botaoMais: {
    width: 52,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
