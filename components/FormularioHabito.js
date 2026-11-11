import { ScrollView, StyleSheet, Text, View } from 'react-native';
import IconePixel from './IconePixel';
import CampoTexto from './CampoTexto';
import MolduraPixel from './MolduraPixel';
import { diasSemana } from '../data/semana';
import { cores, fontes } from '../styles/tema';

export default function FormularioHabito({
  icone = 'fire',
  nome,
  categoria,
  frequencia = [],
  lembrete,
  children,
}) {
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      automaticallyAdjustKeyboardInsets
    >
      <MolduraPixel corFundo={cores.cartaoDestaque} pixel={18} style={styles.selo}>
        <IconePixel nome={icone} tamanho={96} cor={cores.branco} />
      </MolduraPixel>

      <Text style={styles.rotulo}>Nome do hábito</Text>
      <CampoTexto placeholder="Ex.: Beber água" defaultValue={nome} />

      <Text style={styles.rotulo}>Categoria</Text>
      <MolduraPixel corFundo={cores.branco} corTopo={cores.cinzaClaro} style={styles.moldura}>
        <View style={styles.seletor}>
          <IconePixel nome={icone} tamanho={22} cor={cores.preto} />
          <Text style={styles.textoSeletor}>{categoria}</Text>
          <IconePixel nome="chevron-down" tamanho={24} cor={cores.preto} />
        </View>
      </MolduraPixel>

      <Text style={styles.rotulo}>Frequência</Text>
      <View style={styles.dias}>
        {diasSemana.map((dia, indice) => {
          const selecionado = frequencia.includes(indice);

          return (
            <MolduraPixel
              key={`${dia}-${indice}`}
              corFundo={selecionado ? cores.roxoClaro : cores.branco}
              corTopo={selecionado ? undefined : cores.cinzaClaro}
              pixel={3}
              degraus={1}
              style={styles.dia}
            >
              <Text style={styles.textoDia}>{dia}</Text>
            </MolduraPixel>
          );
        })}
      </View>

      <Text style={styles.rotulo}>Lembrete</Text>
      <MolduraPixel corFundo={cores.branco} corTopo={cores.cinzaClaro} style={styles.moldura}>
        <View style={styles.seletor}>
          <IconePixel nome="calendar" tamanho={22} cor={cores.preto} />
          <Text style={styles.textoSeletor}>{lembrete}</Text>
        </View>
      </MolduraPixel>

      <View style={styles.acoes}>{children}</View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 48,
    paddingBottom: 12,
  },
  selo: {
    width: 154,
    height: 148,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  rotulo: {
    color: cores.branco,
    fontSize: 21,
    fontFamily: fontes.negrito,
    fontVariant: fontes.semLigaduras,
    marginTop: 4,
  },
  moldura: {
    marginVertical: 12,
  },
  seletor: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 4,
    height: 50,
  },
  textoSeletor: {
    flex: 1,
    marginLeft: 10,
    fontFamily: fontes.regular,
    fontVariant: fontes.semLigaduras,
    fontSize: 20,
    color: cores.preto,
  },
  dias: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 12,
  },
  dia: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acoes: {
    marginTop: 16,
  },
  textoDia: {
    fontFamily: fontes.regular,
    fontVariant: fontes.semLigaduras,
    fontSize: 20,
    color: cores.preto,
  },
});
