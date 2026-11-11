import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MolduraPixel from './MolduraPixel';
import MascoteRevi, { humorDoRevi } from './MascoteRevi';
import BarraProgresso from './BarraProgresso';
import IconePixel from './IconePixel';
import Pressionavel from './Pressionavel';
import { cores, fontes } from '../styles/tema';
import { XP_POR_NIVEL } from '../utils/estatisticas';

const falas = {
  dormindo: ['Zzz… me acorda com um hábito?', 'Hoje ainda tá zerado…', 'Bora começar?'],
  neutro: ['Bom começo! Mais um?', 'Tô acordando!', 'Cada hábito me dá energia.'],
  feliz: ['Tá ficando bom!', 'Continua assim!', 'Falta pouco pro dia perfeito!'],
  radiante: ['Dia perfeito!', 'Você é demais!', 'Brilhando hoje!'],
};

export default function CartaoRevi({
  concluidos,
  total,
  nivel,
  xpNoNivel,
  aparencia,
  aoPersonalizar,
}) {
  const [fala, setFala] = useState(0);
  const humor = humorDoRevi(concluidos, total);
  const frases = falas[humor];

  return (
    <MolduraPixel corFundo={cores.cartao} corTopo={cores.sombra} pixel={6} style={styles.moldura}>
      <View style={styles.cartao}>
        <MascoteRevi
          humor={humor}
          aparencia={aparencia}
          aoTocar={() => setFala((atual) => (atual + 1) % frases.length)}
        />
        <View style={styles.info}>
          <View style={styles.linha}>
            <Text style={styles.nome} numberOfLines={1}>
              {aparencia.nome}
            </Text>
            <MolduraPixel corFundo={cores.amarelo} pixel={2} degraus={1} style={styles.nivel}>
              <Text style={styles.textoNivel}>{`NV ${nivel}`}</Text>
            </MolduraPixel>
            <Pressionavel
              aoPressionar={aoPersonalizar}
              escala={0.85}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Personalizar o Revi"
            >
              <MolduraPixel corFundo={cores.trilha} pixel={2} degraus={1} style={styles.pincel}>
                <IconePixel nome="brush" tamanho={18} cor={cores.branco} />
              </MolduraPixel>
            </Pressionavel>
          </View>
          <Text style={styles.fala}>{frases[fala % frases.length]}</Text>
          <BarraProgresso
            feitos={Math.floor(xpNoNivel / 10)}
            total={XP_POR_NIVEL / 10}
            cor={cores.amarelo}
          />
          <Text style={styles.xp}>{`${xpNoNivel}/${XP_POR_NIVEL} XP · +10 por hábito`}</Text>
        </View>
      </View>
    </MolduraPixel>
  );
}

const styles = StyleSheet.create({
  moldura: {
    marginBottom: 12,
  },
  cartao: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 18,
    paddingBottom: 14,
    paddingHorizontal: 20,
  },
  info: {
    flex: 1,
    marginLeft: 20,
  },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pincel: {
    width: 30,
    height: 28,
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nome: {
    flex: 1,
    color: cores.branco,
    fontFamily: fontes.negrito,
    fontVariant: fontes.semLigaduras,
    fontSize: 22,
  },
  nivel: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  textoNivel: {
    color: cores.preto,
    fontFamily: fontes.negrito,
    fontVariant: fontes.semLigaduras,
    fontSize: 13,
  },
  fala: {
    color: cores.cinzaClaro,
    fontFamily: fontes.regular,
    fontVariant: fontes.semLigaduras,
    fontSize: 15,
    marginTop: 4,
    marginBottom: 10,
    minHeight: 20,
  },
  xp: {
    color: cores.cinza,
    fontFamily: fontes.regular,
    fontVariant: fontes.semLigaduras,
    fontSize: 12,
    marginTop: 6,
  },
});
