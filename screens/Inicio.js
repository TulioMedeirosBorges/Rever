import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Tela from '../components/Tela';
import PixelsDecorativos from '../components/PixelsDecorativos';
import IconePixel from '../components/IconePixel';
import AnelProgresso from '../components/AnelProgresso';
import MolduraPixel from '../components/MolduraPixel';
import FaixaArcoIris from '../components/FaixaArcoIris';
import ItemHabito from '../components/ItemHabito';
import BarraInferior from '../components/BarraInferior';
import { useHabitos } from '../contexto/HabitosContexto';
import { diasSemana } from '../data/semana';
import { cores, fontes } from '../styles/tema';
import { toqueLeve } from '../utils/tato';

const nomesDias = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
const nomesMeses = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro',
];

const mensagem = (concluidos, total) => {
  if (total === 0) {
    return 'Crie seu primeiro hábito no +';
  }
  if (concluidos === total) {
    return 'Tudo feito por hoje. Mandou bem!';
  }
  if (concluidos === 0) {
    return 'Que tal manter o foco hoje?';
  }
  const faltam = total - concluidos;
  return faltam === 1 ? 'Falta só 1 hábito. Bora!' : `Continue assim, faltam ${faltam}.`;
};

export default function Inicio({ navigation }) {
  const { habitos, alternarConcluido } = useHabitos();
  const [agora, setAgora] = useState(() => new Date());

  useEffect(() => {
    const relogio = setInterval(() => setAgora(new Date()), 60000);
    return () => clearInterval(relogio);
  }, []);

  const total = habitos.length;
  const concluidos = habitos.filter((habito) => habito.concluido).length;
  const progresso = total > 0 ? concluidos / total : 0;
  const completo = total > 0 && concluidos === total;
  const hoje = (agora.getDay() + 6) % 7;
  const data = `${nomesDias[agora.getDay()]}, ${agora.getDate()} de ${nomesMeses[agora.getMonth()]}`;

  const corDoFogo = (indice) => {
    if (indice < hoje) {
      return cores.arcoIris[0];
    }
    if (indice === hoje && concluidos > 0) {
      return cores.arcoIris[1];
    }
    return cores.cinza;
  };

  return (
    <Tela bordas={['top']}>
      <PixelsDecorativos />
      <ScrollView contentContainerStyle={styles.conteudo} showsVerticalScrollIndicator={false}>
        <View style={styles.topo}>
          <View style={styles.textosTopo}>
            <Text style={styles.data}>{data}</Text>
            <Text style={styles.ola} numberOfLines={1} adjustsFontSizeToFit>
              Olá, Usuário
            </Text>
            <Text style={styles.subtitulo}>{mensagem(concluidos, total)}</Text>
          </View>
          <TouchableOpacity
            style={styles.engrenagem}
            onPress={() => {
              toqueLeve();
              navigation.replace('Perfil');
            }}
            activeOpacity={0.6}
            accessibilityLabel="Configurações"
          >
            <IconePixel nome="settings-cog" tamanho={30} cor={cores.branco} />
          </TouchableOpacity>
        </View>
        <FaixaArcoIris />

        <MolduraPixel
          corFundo={completo ? cores.cartaoDestaque : cores.cartao}
          corTopo={cores.sombra}
          pixel={6}
          style={styles.molduraCartao}
        >
          <View style={styles.cartao}>
            <AnelProgresso progresso={progresso} cor={completo ? cores.amarelo : cores.branco} />
            <View style={styles.resumo}>
              <Text style={styles.contagem}>
                <Text style={completo ? styles.contagemCompleta : null}>{concluidos}</Text>
                {` de ${total}`}
              </Text>
              <Text style={styles.textoResumo}>Hábitos{'\n'}concluídos</Text>
              <View style={styles.sequencia}>
                {diasSemana.map((dia, indice) => (
                  <View key={`${dia}-${indice}`} style={styles.diaSequencia}>
                    <IconePixel nome="fire" tamanho={18} cor={corDoFogo(indice)} />
                    <Text style={[styles.letraDia, indice === hoje && styles.letraHoje]}>
                      {dia}
                    </Text>
                    <View style={[styles.marcaHoje, indice === hoje && styles.marcaHojeAtiva]} />
                  </View>
                ))}
              </View>
            </View>
          </View>
        </MolduraPixel>

        <View style={styles.cabecalhoLista}>
          <Text style={styles.secao}>Seus hábitos</Text>
          <MolduraPixel corFundo={cores.roxoEscuro} pixel={2} degraus={1} style={styles.selo}>
            <Text style={styles.textoSelo}>{`${concluidos}/${total}`}</Text>
          </MolduraPixel>
        </View>

        {habitos.map(({ id, nome, icone, categoria, lembrete, concluido }) => (
          <ItemHabito
            key={id}
            nome={nome}
            icone={icone}
            detalhe={lembrete ? `${categoria} · ${lembrete}` : categoria}
            concluido={concluido}
            mostrarSeta
            aoMarcar={() => alternarConcluido(id)}
            aoPressionar={() => navigation.navigate('EditarHabito', { id })}
          />
        ))}

        {total === 0 ? (
          <MolduraPixel corFundo={cores.cartao} pixel={3} style={styles.vazio}>
            <IconePixel nome="sparkle" tamanho={40} cor={cores.roxo} />
            <Text style={styles.textoVazio}>Nenhum hábito ainda.</Text>
            <Text style={styles.dicaVazio}>Toque no + lá embaixo para criar o primeiro.</Text>
          </MolduraPixel>
        ) : null}
      </ScrollView>
      <BarraInferior abaAtiva="Inicio" />
    </Tela>
  );
}

const styles = StyleSheet.create({
  conteudo: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  topo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 14,
  },
  textosTopo: {
    flex: 1,
    marginRight: 12,
  },
  data: {
    color: cores.roxo,
    fontFamily: fontes.media,
    fontVariant: fontes.semLigaduras,
    fontSize: 14,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  ola: {
    color: cores.branco,
    fontSize: 33,
    fontFamily: fontes.negrito,
    fontVariant: fontes.semLigaduras,
  },
  subtitulo: {
    color: cores.branco,
    fontFamily: fontes.regular,
    fontVariant: fontes.semLigaduras,
    fontSize: 15,
  },
  engrenagem: {
    padding: 8,
    marginRight: -8,
  },
  molduraCartao: {
    marginTop: 22,
    marginBottom: 26,
  },
  cartao: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 22,
    paddingBottom: 16,
    paddingHorizontal: 22,
  },
  resumo: {
    flex: 1,
    marginLeft: 24,
  },
  contagem: {
    color: cores.branco,
    fontSize: 22,
    fontFamily: fontes.negrito,
    fontVariant: fontes.semLigaduras,
  },
  contagemCompleta: {
    color: cores.amarelo,
  },
  textoResumo: {
    color: cores.branco,
    fontFamily: fontes.regular,
    fontVariant: fontes.semLigaduras,
    fontSize: 22,
    lineHeight: 24,
    marginBottom: 10,
  },
  sequencia: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  diaSequencia: {
    alignItems: 'center',
  },
  letraDia: {
    color: cores.cinza,
    fontFamily: fontes.regular,
    fontVariant: fontes.semLigaduras,
    fontSize: 11,
  },
  letraHoje: {
    color: cores.branco,
    fontFamily: fontes.negrito,
  },
  marcaHoje: {
    width: 4,
    height: 4,
    marginTop: 2,
  },
  marcaHojeAtiva: {
    backgroundColor: cores.branco,
  },
  cabecalhoLista: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  secao: {
    color: cores.branco,
    fontSize: 24,
    fontFamily: fontes.negrito,
    fontVariant: fontes.semLigaduras,
  },
  selo: {
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  textoSelo: {
    color: cores.branco,
    fontFamily: fontes.media,
    fontVariant: fontes.semLigaduras,
    fontSize: 15,
  },
  vazio: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  textoVazio: {
    color: cores.branco,
    fontFamily: fontes.negrito,
    fontVariant: fontes.semLigaduras,
    fontSize: 20,
    marginTop: 10,
  },
  dicaVazio: {
    color: cores.cinzaClaro,
    fontFamily: fontes.regular,
    fontVariant: fontes.semLigaduras,
    fontSize: 15,
    textAlign: 'center',
    marginTop: 4,
  },
});
