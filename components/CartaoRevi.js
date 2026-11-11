import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MolduraPixel from './MolduraPixel';
import MascoteRevi, { humorDoRevi } from './MascoteRevi';
import BalaoFala from './BalaoFala';
import BarraProgresso from './BarraProgresso';
import IconePixel from './IconePixel';
import Pressionavel from './Pressionavel';
import { cores, fontes } from '../styles/tema';
import { XP_POR_NIVEL } from '../utils/estatisticas';

const falasDoHumor = {
  dormindo: ['Zzz… me acorda com um hábito?', 'Hoje ainda tá zerado…'],
  neutro: ['Bom começo! Bora mais um?', 'Cada hábito me dá energia!'],
  feliz: ['Tá ficando bom demais!', 'Continua assim, tô animado!'],
  radiante: ['Dia perfeito! Você é demais!', 'Tô brilhando de orgulho!'],
};

const saudacao = (hora) => {
  if (hora >= 5 && hora < 12) {
    return 'Bom dia';
  }
  return hora >= 12 && hora < 18 ? 'Boa tarde' : 'Boa noite';
};

// Monta as falas com o que está acontecendo no dia.
const montarFalas = ({ humor, concluidos, total, sequencia, proximo, nomeUsuario, xpFalta }) => {
  const falas = [`${saudacao(new Date().getHours())}, ${nomeUsuario}!`, ...falasDoHumor[humor]];
  if (total > concluidos) {
    const faltam = total - concluidos;
    falas.push(
      faltam === 1 ? 'Falta só 1 pro dia perfeito!' : `Faltam ${faltam} pro dia perfeito.`,
    );
  }
  if (proximo) {
    falas.push(`Às ${proximo.horario} tem ${proximo.nome}. Não esquece!`);
  }
  if (sequencia > 1) {
    falas.push(`${sequencia} dias seguidos! Não para agora!`);
  }
  falas.push(`Mais ${xpFalta} XP e eu subo de nível!`);
  return falas;
};

export default function CartaoRevi({
  concluidos,
  total,
  nivel,
  xpNoNivel,
  sequencia = 0,
  proximo,
  nomeUsuario,
  aparencia,
  aoPersonalizar,
}) {
  const [fala, setFala] = useState(0);
  const [falando, setFalando] = useState(false);
  const humor = humorDoRevi(concluidos, total);
  const falas = montarFalas({
    humor,
    concluidos,
    total,
    sequencia,
    proximo,
    nomeUsuario,
    xpFalta: XP_POR_NIVEL - xpNoNivel,
  });

  const conversar = () => {
    setFalando(true);
    setFala((atual) => (atual + 1) % falas.length);
  };

  return (
    <MolduraPixel corFundo={cores.cartao} corTopo={cores.sombra} pixel={6} style={styles.moldura}>
      <View style={styles.cartao}>
        <View style={styles.conversa}>
          <MascoteRevi humor={humor} aparencia={aparencia} aoTocar={conversar} />
          <BalaoFala texto={falas[fala % falas.length]} falando={falando} />
        </View>

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
        <BarraProgresso
          feitos={Math.floor(xpNoNivel / 10)}
          total={XP_POR_NIVEL / 10}
          cor={cores.amarelo}
        />
        <Text
          style={styles.xp}
        >{`${xpNoNivel}/${XP_POR_NIVEL} XP · toque no ${aparencia.nome} para conversar`}</Text>
      </View>
    </MolduraPixel>
  );
}

const styles = StyleSheet.create({
  moldura: {
    marginBottom: 12,
  },
  cartao: {
    paddingTop: 18,
    paddingBottom: 14,
    paddingHorizontal: 18,
  },
  conversa: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  nome: {
    flex: 1,
    color: cores.branco,
    fontFamily: fontes.negrito,
    fontVariant: fontes.semLigaduras,
    fontSize: 20,
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
  pincel: {
    width: 30,
    height: 28,
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  xp: {
    color: cores.cinza,
    fontFamily: fontes.regular,
    fontVariant: fontes.semLigaduras,
    fontSize: 12,
    marginTop: 6,
  },
});
