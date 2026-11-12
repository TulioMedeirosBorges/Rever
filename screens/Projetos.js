import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Tela from '../components/Tela';
import PixelsDecorativos from '../components/PixelsDecorativos';
import CabecalhoTela from '../components/CabecalhoTela';
import MolduraPixel from '../components/MolduraPixel';
import IconePixel from '../components/IconePixel';
import BarraProgresso from '../components/BarraProgresso';
import Botao from '../components/Botao';
import LinkTexto from '../components/LinkTexto';
import Pressionavel from '../components/Pressionavel';
import Entrada from '../components/Entrada';
import ChatRevi from '../components/ChatRevi';
import { BotaoHoje, JanelaHoje } from '../components/HojeNoProjeto';
import { useHabitos } from '../contexto/HabitosContexto';
import { cores, fontes } from '../styles/tema';
import { rotuloData } from '../utils/datas';
import { instrucoesPlanejarProjeto } from '../utils/reviIA';

const visoes = [
  { id: 'lista', rotulo: 'Meus projetos' },
  { id: 'chat', rotulo: 'Planejar com o Revi' },
];

const atalhos = ['Estudar pra uma prova', 'Fazer meu TCC', 'Aprender a programar'];

export default function Projetos({ navigation, route }) {
  const { projetos, revi, usuario } = useHabitos();
  const [visao, setVisao] = useState(
    route.params?.aba ?? (projetos.length === 0 ? 'chat' : 'lista'),
  );
  const [abertoId, setAbertoId] = useState(null);

  // Ao continuar uma conversa do histórico, a aba abre direto no chat.
  const abaPedida = route.params?.aba;
  useEffect(() => {
    if (abaPedida) {
      setVisao(abaPedida);
      navigation.setParams({ aba: undefined });
    }
  }, [abaPedida, navigation]);
  const aberto = projetos.find(({ id }) => id === abertoId) ?? null;

  const focar = (projeto, sessao) => {
    setAbertoId(null);
    navigation.navigate('Foco', {
      sessao: {
        projetoId: projeto.id,
        sessaoId: sessao.id,
        minutos: sessao.minutos,
        titulo: `${projeto.nome}: ${sessao.titulo}`,
      },
    });
  };

  return (
    <Tela bordas={['top']}>
      <PixelsDecorativos />
      <View style={styles.topo}>
        <CabecalhoTela titulo="Projetos" />
        <MolduraPixel corFundo={cores.cartao} pixel={3}>
          <View style={styles.visoes}>
            {visoes.map(({ id, rotulo }) => {
              const ativa = id === visao;
              return (
                <Pressionavel
                  key={id}
                  style={styles.visao}
                  aoPressionar={() => setVisao(id)}
                  escala={0.94}
                  vibracaoSoltar="selecao"
                  som="navegar"
                  accessibilityRole="tab"
                  accessibilityState={{ selected: ativa }}
                >
                  <MolduraPixel corFundo={ativa ? cores.cartaoDestaque : 'transparent'} pixel={3}>
                    <Text style={[styles.textoVisao, ativa && styles.textoVisaoAtiva]}>
                      {rotulo}
                    </Text>
                  </MolduraPixel>
                </Pressionavel>
              );
            })}
          </View>
        </MolduraPixel>
      </View>

      {visao === 'chat' ? (
        <ChatRevi
          canal="projeto"
          navigation={navigation}
          instrucoes={instrucoesPlanejarProjeto}
          saudacao={`Bora tirar uma ideia do papel, ${usuario.nome}? Me conta o projeto que eu te ajudo a dividir em dias, com o que fazer em cada um.`}
          atalhos={atalhos}
        />
      ) : (
        <ScrollView contentContainerStyle={styles.conteudo} showsVerticalScrollIndicator={false}>
          {projetos.length === 0 ? (
            <Entrada tipo="escala">
              <MolduraPixel corFundo={cores.cartao} pixel={4}>
                <View style={styles.vazio}>
                  <IconePixel nome="clipboard-note" tamanho={40} cor={cores.turquesa} />
                  <Text style={styles.textoVazio}>Nenhum projeto ainda.</Text>
                  <Text style={styles.dicaVazio}>
                    {`Conta sua ideia pro ${revi.nome} e ele monta o plano dia a dia.`}
                  </Text>
                </View>
              </MolduraPixel>
            </Entrada>
          ) : null}

          {projetos.map((projeto, indice) => {
            const feitas = projeto.sessoes.filter(({ feita }) => feita).length;
            return (
              <Entrada key={projeto.id} ordem={indice} style={styles.cartao}>
                <Pressionavel
                  aoPressionar={() => navigation.navigate('ProjetoDetalhe', { id: projeto.id })}
                  escala={0.98}
                >
                  <MolduraPixel corFundo={cores.cartao} corTopo={projeto.cor} pixel={3}>
                    <View style={styles.projeto}>
                      <View style={styles.linhaProjeto}>
                        <IconePixel
                          nome={projeto.icone ?? 'clipboard-note'}
                          tamanho={22}
                          cor={projeto.cor ?? cores.turquesa}
                        />
                        <Text style={styles.nomeProjeto} numberOfLines={1}>
                          {projeto.nome}
                        </Text>
                        <Text style={styles.contagem}>{`${feitas}/${projeto.sessoes.length}`}</Text>
                      </View>
                      <BarraProgresso
                        feitos={Math.round((feitas / Math.max(1, projeto.sessoes.length)) * 10)}
                        total={10}
                        cor={projeto.cor ?? cores.turquesa}
                      />
                      <Text style={styles.prazo}>{`Prazo: ${rotuloData(projeto.prazo)}`}</Text>
                    </View>
                  </MolduraPixel>
                </Pressionavel>
                <BotaoHoje projeto={projeto} aoPressionar={() => setAbertoId(projeto.id)} />
              </Entrada>
            );
          })}

          <View style={styles.acoes}>
            <Botao texto={`Planejar com o ${revi.nome}`} aoPressionar={() => setVisao('chat')} />
            <LinkTexto
              texto="Prefiro preencher um formulário"
              aoPressionar={() => navigation.navigate('NovoProjeto')}
            />
          </View>
        </ScrollView>
      )}

      <JanelaHoje
        projeto={aberto}
        visivel={Boolean(aberto)}
        aoFechar={() => setAbertoId(null)}
        aoFocar={(sessao) => focar(aberto, sessao)}
      />
    </Tela>
  );
}

const styles = StyleSheet.create({
  topo: {
    paddingHorizontal: 20,
    paddingTop: 48,
  },
  visoes: {
    flexDirection: 'row',
    padding: 4,
  },
  visao: {
    flex: 1,
  },
  textoVisao: {
    color: cores.cinzaClaro,
    fontFamily: fontes.media,
    fontVariant: fontes.semLigaduras,
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 9,
  },
  textoVisaoAtiva: {
    color: cores.branco,
    fontFamily: fontes.negrito,
  },
  conteudo: {
    padding: 20,
  },
  vazio: {
    alignItems: 'center',
    padding: 20,
  },
  textoVazio: {
    color: cores.branco,
    fontFamily: fontes.negrito,
    fontVariant: fontes.semLigaduras,
    fontSize: 18,
    marginTop: 10,
  },
  dicaVazio: {
    color: cores.cinzaClaro,
    fontFamily: fontes.regular,
    fontVariant: fontes.semLigaduras,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4,
  },
  cartao: {
    marginBottom: 18,
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
    color: cores.cinzaClaro,
    fontFamily: fontes.negrito,
    fontVariant: fontes.semLigaduras,
    fontSize: 15,
  },
  prazo: {
    color: cores.cinzaClaro,
    fontFamily: fontes.regular,
    fontVariant: fontes.semLigaduras,
    fontSize: 13,
    marginTop: 8,
  },
  acoes: {
    marginTop: 6,
  },
});
