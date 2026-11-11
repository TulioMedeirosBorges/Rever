import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Tela from '../components/Tela';
import PixelsDecorativos from '../components/PixelsDecorativos';
import CabecalhoTela from '../components/CabecalhoTela';
import MolduraPixel from '../components/MolduraPixel';
import IconePixel from '../components/IconePixel';
import BarraProgresso from '../components/BarraProgresso';
import Botao from '../components/Botao';
import Pressionavel from '../components/Pressionavel';
import MascoteRevi from '../components/MascoteRevi';
import BalaoFala from '../components/BalaoFala';
import Entrada from '../components/Entrada';
import BarraInferior from '../components/BarraInferior';
import { useHabitos } from '../contexto/HabitosContexto';
import { cores, fontes } from '../styles/tema';
import { chaveDia, rotuloData } from '../utils/datas';

const proximaSessao = (projeto, hoje) =>
  projeto.sessoes.find(({ data, feita }) => !feita && data >= hoje);

export default function Projetos({ navigation }) {
  const { projetos, revi } = useHabitos();
  const hoje = chaveDia(new Date());

  const deHoje = projetos.flatMap((projeto) =>
    projeto.sessoes
      .filter(({ data, feita }) => data === hoje && !feita)
      .map((sessao) => ({ projeto, sessao })),
  );

  const focar = (projeto, sessao) =>
    navigation.navigate('Foco', {
      sessao: {
        projetoId: projeto.id,
        sessaoId: sessao.id,
        minutos: sessao.minutos,
        titulo: `${projeto.nome}: ${sessao.titulo}`,
      },
    });

  return (
    <Tela bordas={['top']}>
      <PixelsDecorativos />
      <ScrollView contentContainerStyle={styles.conteudo} showsVerticalScrollIndicator={false}>
        <CabecalhoTela titulo="Projetos" />

        <Entrada tipo="escala" style={styles.conversa}>
          <MascoteRevi humor="feliz" aparencia={revi} bloco={4} />
          <BalaoFala
            texto={
              projetos.length === 0
                ? 'Me conta um projeto e o prazo. Eu separo os dias de foco na sua semana!'
                : deHoje.length > 0
                  ? `Hoje tem ${deHoje.length} sessão de projeto. Bora focar?`
                  : 'Nada de projeto hoje. Aproveita pra descansar!'
            }
          />
        </Entrada>

        <Entrada ordem={1}>
          <Botao
            texto={`Novo projeto com o ${revi.nome}`}
            aoPressionar={() => navigation.navigate('NovoProjeto')}
          />
        </Entrada>

        {deHoje.length > 0 ? (
          <>
            <Text style={styles.secao}>Foco de hoje</Text>
            {deHoje.map(({ projeto, sessao }, indice) => (
              <Entrada key={`${projeto.id}-${sessao.id}`} ordem={2 + indice}>
                <MolduraPixel corFundo={cores.cartaoDestaque} corTopo={cores.laranja} pixel={3}>
                  <View style={styles.linhaHoje}>
                    <IconePixel nome="clock" tamanho={24} cor={cores.laranja} />
                    <View style={styles.textos}>
                      <Text style={styles.nomeHoje} numberOfLines={1}>
                        {sessao.titulo}
                      </Text>
                      <Text
                        style={styles.detalhe}
                      >{`${projeto.nome} · ${sessao.minutos} min`}</Text>
                    </View>
                    <Pressionavel
                      aoPressionar={() => focar(projeto, sessao)}
                      escala={0.88}
                      vibracaoApertar="apertar"
                    >
                      <MolduraPixel corFundo={cores.principal} pixel={2} degraus={1}>
                        <Text style={styles.textoFocar}>Focar</Text>
                      </MolduraPixel>
                    </Pressionavel>
                  </View>
                </MolduraPixel>
              </Entrada>
            ))}
          </>
        ) : null}

        {projetos.length > 0 ? <Text style={styles.secao}>Seus projetos</Text> : null}
        {projetos.map((projeto, indice) => {
          const feitas = projeto.sessoes.filter(({ feita }) => feita).length;
          const proxima = proximaSessao(projeto, hoje);
          return (
            <Entrada key={projeto.id} ordem={3 + indice}>
              <Pressionavel
                aoPressionar={() => navigation.navigate('ProjetoDetalhe', { id: projeto.id })}
                escala={0.97}
                style={styles.toque}
              >
                <MolduraPixel corFundo={cores.cartao} pixel={3}>
                  <View style={styles.projeto}>
                    <View style={styles.linhaProjeto}>
                      <IconePixel nome="clipboard-note" tamanho={22} cor={cores.turquesa} />
                      <Text style={styles.nomeProjeto} numberOfLines={1}>
                        {projeto.nome}
                      </Text>
                      <Text style={styles.contagem}>{`${feitas}/${projeto.sessoes.length}`}</Text>
                    </View>
                    <BarraProgresso
                      feitos={Math.round((feitas / Math.max(1, projeto.sessoes.length)) * 10)}
                      total={10}
                    />
                    <Text style={styles.detalhe}>
                      {proxima
                        ? `Próxima: ${rotuloData(proxima.data)} · até ${rotuloData(projeto.prazo)}`
                        : feitas === projeto.sessoes.length
                          ? 'Concluído! 🎉'
                          : `Prazo: ${rotuloData(projeto.prazo)}`}
                    </Text>
                  </View>
                </MolduraPixel>
              </Pressionavel>
            </Entrada>
          );
        })}
      </ScrollView>
      <BarraInferior abaAtiva="Projetos" />
    </Tela>
  );
}

const styles = StyleSheet.create({
  conteudo: {
    padding: 20,
    paddingTop: 48,
  },
  conversa: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  secao: {
    color: cores.branco,
    fontFamily: fontes.negrito,
    fontVariant: fontes.semLigaduras,
    fontSize: 22,
    marginTop: 18,
    marginBottom: 10,
  },
  linhaHoje: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    paddingTop: 14,
  },
  textos: {
    flex: 1,
    marginHorizontal: 10,
  },
  nomeHoje: {
    color: cores.branco,
    fontFamily: fontes.negrito,
    fontVariant: fontes.semLigaduras,
    fontSize: 16,
  },
  detalhe: {
    color: cores.cinzaClaro,
    fontFamily: fontes.regular,
    fontVariant: fontes.semLigaduras,
    fontSize: 13,
    marginTop: 6,
  },
  textoFocar: {
    color: cores.preto,
    fontFamily: fontes.negrito,
    fontVariant: fontes.semLigaduras,
    fontSize: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  toque: {
    marginBottom: 10,
  },
  projeto: {
    padding: 14,
  },
  linhaProjeto: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  nomeProjeto: {
    flex: 1,
    color: cores.branco,
    fontFamily: fontes.negrito,
    fontVariant: fontes.semLigaduras,
    fontSize: 18,
    marginLeft: 10,
  },
  contagem: {
    color: cores.turquesa,
    fontFamily: fontes.negrito,
    fontVariant: fontes.semLigaduras,
    fontSize: 15,
  },
});
