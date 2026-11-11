import { StyleSheet, Text, View } from 'react-native';
import MolduraPixel from './MolduraPixel';
import AnelProgresso from './AnelProgresso';
import IconePixel from './IconePixel';
import { diasSemana } from '../data/semana';
import { cores, fontes } from '../styles/tema';

const estiloDoDia = ({ feitos, futuro }, ehHoje) => {
  if (futuro) {
    return { fundo: cores.fundo, icone: null };
  }
  if (feitos > 0) {
    return { fundo: ehHoje ? cores.laranja : cores.vermelho, icone: cores.fundo };
  }
  return { fundo: cores.trilha, icone: null };
};

export default function CartaoResumo({
  concluidos,
  total,
  semana,
  indiceHoje,
  sequencia,
  proximo,
}) {
  const progresso = total > 0 ? concluidos / total : 0;
  const completo = total > 0 && concluidos === total;

  let rodape = { icone: 'bell', cor: cores.turquesa, texto: 'Sem lembretes pendentes hoje.' };
  if (completo) {
    rodape = { icone: 'check', cor: cores.amarelo, texto: 'Dia perfeito! Tudo feito por hoje.' };
  } else if (proximo) {
    rodape = {
      icone: 'bell',
      cor: cores.turquesa,
      texto: `Próximo: ${proximo.nome} às ${proximo.horario}`,
    };
  }

  return (
    <MolduraPixel
      corFundo={completo ? cores.cartaoDestaque : cores.cartao}
      corTopo={cores.sombra}
      pixel={6}
      style={styles.moldura}
    >
      <View style={styles.cartao}>
        <View style={styles.topo}>
          <AnelProgresso progresso={progresso} cor={completo ? cores.amarelo : cores.principal} />
          <View style={styles.resumo}>
            <Text style={styles.rotulo}>Hoje</Text>
            <Text style={[styles.numero, completo && styles.numeroCompleto]}>
              {concluidos}
              <Text style={styles.total}>{`/${total}`}</Text>
            </Text>
            <Text style={styles.legenda}>{total === 1 ? 'hábito feito' : 'hábitos feitos'}</Text>
            <MolduraPixel corFundo={cores.trilha} pixel={2} degraus={1} style={styles.chip}>
              <View style={styles.linhaChip}>
                <IconePixel
                  nome="fire"
                  tamanho={16}
                  cor={sequencia > 0 ? cores.laranja : cores.cinza}
                />
                <Text style={styles.textoChip}>
                  {sequencia === 1 ? '1 dia seguido' : `${sequencia} dias seguidos`}
                </Text>
              </View>
            </MolduraPixel>
          </View>
        </View>

        <View style={styles.divisor} />

        <View style={styles.semana}>
          {diasSemana.map((letra, indice) => {
            const ehHoje = indice === indiceHoje;
            const { fundo, icone } = estiloDoDia(semana[indice], ehHoje);

            return (
              <View key={`${letra}-${indice}`} style={styles.dia}>
                <Text style={[styles.letra, ehHoje && styles.letraHoje]}>{letra}</Text>
                <MolduraPixel
                  corFundo={fundo}
                  corTopo={ehHoje && !icone ? cores.laranja : undefined}
                  pixel={3}
                  degraus={1}
                  style={styles.bloco}
                >
                  {icone ? <IconePixel nome="fire" tamanho={18} cor={icone} /> : null}
                </MolduraPixel>
              </View>
            );
          })}
        </View>

        <View style={styles.rodape}>
          <IconePixel nome={rodape.icone} tamanho={18} cor={rodape.cor} />
          <Text style={styles.textoRodape} numberOfLines={1}>
            {rodape.texto}
          </Text>
        </View>
      </View>
    </MolduraPixel>
  );
}

const styles = StyleSheet.create({
  moldura: {
    marginTop: 22,
    marginBottom: 14,
  },
  cartao: {
    paddingTop: 22,
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  topo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resumo: {
    flex: 1,
    marginLeft: 22,
  },
  rotulo: {
    color: cores.turquesa,
    fontFamily: fontes.media,
    fontVariant: fontes.semLigaduras,
    fontSize: 13,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  numero: {
    color: cores.branco,
    fontFamily: fontes.negrito,
    fontVariant: fontes.semLigaduras,
    fontSize: 44,
    lineHeight: 50,
  },
  numeroCompleto: {
    color: cores.amarelo,
  },
  total: {
    color: cores.cinza,
    fontSize: 26,
  },
  legenda: {
    color: cores.cinzaClaro,
    fontFamily: fontes.regular,
    fontVariant: fontes.semLigaduras,
    fontSize: 16,
    marginTop: -2,
    marginBottom: 10,
  },
  chip: {
    alignSelf: 'flex-start',
  },
  linhaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  textoChip: {
    color: cores.branco,
    fontFamily: fontes.media,
    fontVariant: fontes.semLigaduras,
    fontSize: 13,
    marginLeft: 6,
  },
  divisor: {
    height: 2,
    backgroundColor: cores.sombra,
    marginTop: 18,
    marginBottom: 14,
  },
  semana: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dia: {
    alignItems: 'center',
  },
  letra: {
    color: cores.cinza,
    fontFamily: fontes.media,
    fontVariant: fontes.semLigaduras,
    fontSize: 13,
    marginBottom: 6,
  },
  letraHoje: {
    color: cores.laranja,
    fontFamily: fontes.negrito,
  },
  bloco: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rodape: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  textoRodape: {
    flex: 1,
    color: cores.cinzaClaro,
    fontFamily: fontes.media,
    fontVariant: fontes.semLigaduras,
    fontSize: 14,
    marginLeft: 8,
  },
});
