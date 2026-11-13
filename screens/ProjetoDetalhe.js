import { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import Tela from "../components/Tela";
import PixelsDecorativos from "../components/PixelsDecorativos";
import CabecalhoTela from "../components/CabecalhoTela";
import MolduraPixel from "../components/MolduraPixel";
import IconePixel from "../components/IconePixel";
import BarraProgresso from "../components/BarraProgresso";
import Botao from "../components/Botao";
import Pressionavel from "../components/Pressionavel";
import Entrada from "../components/Entrada";
import { useHabitos } from "../contexto/HabitosContexto";
import { cores, fontes } from "../styles/tema";
import { chaveDia, rotuloData } from "../utils/datas";
import { formatarDuracao } from "../utils/reviIA";
import { BotaoHoje, JanelaHoje } from "../components/HojeNoProjeto";

export default function ProjetoDetalhe({ navigation, route }) {
  const { id } = route.params;
  const { projetos, alternarSessao, excluirProjeto } = useHabitos();
  const [janelaAberta, setJanelaAberta] = useState(false);
  const projeto = projetos.find((item) => item.id === id);

  if (!projeto) {
    return null;
  }

  const hoje = chaveDia(new Date());
  const feitas = projeto.sessoes.filter(({ feita }) => feita).length;
  const proxima = projeto.sessoes.find(
    ({ data, feita }) => !feita && data >= hoje,
  );

  const focar = (sessao) =>
    navigation.navigate("Foco", {
      sessao: {
        projetoId: projeto.id,
        sessaoId: sessao.id,
        minutos: sessao.minutos,
        titulo: `${projeto.nome}: ${sessao.titulo}`,
      },
    });

  const excluir = () =>
    Alert.alert(
      "Excluir projeto",
      `Apagar "${projeto.nome}" e todas as sessões?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => {
            navigation.goBack();
            excluirProjeto(projeto.id);
          },
        },
      ],
    );

  return (
    <Tela bordas={["top", "bottom"]}>
      <PixelsDecorativos />
      <View style={styles.cabecalho}>
        <CabecalhoTela
          titulo={projeto.nome}
          mostrarVoltar
          aoVoltar={() => navigation.goBack()}
        />
      </View>
      <ScrollView
        contentContainerStyle={styles.conteudo}
        showsVerticalScrollIndicator={false}
      >
        <Entrada tipo="escala">
          <MolduraPixel
            corFundo={cores.cartao}
            corTopo={cores.sombra}
            pixel={5}
          >
            <View style={styles.resumo}>
              {projeto.objetivo ? (
                <Text style={styles.objetivo}>{projeto.objetivo}</Text>
              ) : null}
              <View style={styles.linha}>
                <Text style={styles.numero}>
                  {feitas}
                  <Text
                    style={styles.total}
                  >{`/${projeto.sessoes.length} sessões`}</Text>
                </Text>
                <Text
                  style={styles.prazo}
                >{`até ${rotuloData(projeto.prazo)}`}</Text>
              </View>
              <BarraProgresso
                feitos={Math.round(
                  (feitas / Math.max(1, projeto.sessoes.length)) * 12,
                )}
                total={12}
              />
              {projeto.resumo ? (
                <Text style={styles.fala}>{`“${projeto.resumo}”`}</Text>
              ) : null}
            </View>
          </MolduraPixel>
        </Entrada>

        {proxima ? (
          <Entrada ordem={1}>
            <BotaoHoje
              projeto={projeto}
              aoPressionar={() => setJanelaAberta(true)}
            />
          </Entrada>
        ) : null}

        {projeto.etapas?.length > 0 ? (
          <>
            <Text style={styles.secao}>Etapas</Text>
            <View style={styles.etapas}>
              {projeto.etapas.map((etapa, indice) => (
                <MolduraPixel
                  key={etapa}
                  corFundo={cores.cartao}
                  pixel={2}
                  degraus={1}
                >
                  <Text
                    style={styles.textoEtapa}
                  >{`${indice + 1}. ${etapa}`}</Text>
                </MolduraPixel>
              ))}
            </View>
          </>
        ) : null}

        <Text style={styles.secao}>Cronograma</Text>
        {projeto.sessoes.map((sessao, indice) => {
          const ehHoje = sessao.data === hoje;
          const passou = sessao.data < hoje;
          const atrasada = !sessao.feita && passou;
          return (
            <Entrada key={sessao.id} ordem={2 + indice}>
              <MolduraPixel
                corFundo={ehHoje ? cores.cartaoDestaque : cores.cartao}
                corTopo={ehHoje ? cores.laranja : undefined}
                pixel={3}
                style={styles.sessao}
              >
                <View style={styles.linhaSessao}>
                  <Pressionavel
                    aoPressionar={() => alternarSessao(projeto.id, sessao.id)}
                    disabled={passou}
                    escala={0.75}
                    hitSlop={10}
                    vibracaoSoltar={sessao.feita ? "soltar" : "sucesso"}
                    som={sessao.feita ? "desmarcar" : "marcar"}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: sessao.feita }}
                  >
                    <MolduraPixel
                      corFundo={sessao.feita ? cores.sucesso : cores.trilha}
                      pixel={3}
                      degraus={1}
                      style={[styles.caixa, passou && styles.caixaTravada]}
                    >
                      {sessao.feita ? (
                        <IconePixel
                          nome="check"
                          tamanho={20}
                          cor={cores.fundo}
                        />
                      ) : null}
                      {atrasada ? (
                        <IconePixel
                          nome="lock"
                          tamanho={16}
                          cor={cores.cinza}
                        />
                      ) : null}
                    </MolduraPixel>
                  </Pressionavel>
                  <View style={styles.textos}>
                    <Text
                      style={[
                        styles.tituloSessao,
                        sessao.feita && styles.feita,
                      ]}
                      numberOfLines={1}
                    >
                      {sessao.titulo}
                    </Text>
                    <Text
                      style={[styles.dataSessao, atrasada && styles.atrasada]}
                    >
                      {`${ehHoje ? "hoje" : rotuloData(sessao.data)} · ${formatarDuracao(
                        sessao.minutos,
                      )}${atrasada ? " · não foi feita" : ""}`}
                    </Text>
                    {(sessao.tarefas ?? []).map((tarefa, posicao) => (
                      <Text
                        key={tarefa}
                        style={[
                          styles.tarefa,
                          (sessao.tarefasFeitas ?? []).includes(posicao) &&
                            styles.feita,
                        ]}
                        numberOfLines={2}
                      >
                        {`▪ ${tarefa}`}
                      </Text>
                    ))}
                  </View>
                  {!sessao.feita && !passou ? (
                    <Pressionavel
                      aoPressionar={() => focar(sessao)}
                      escala={0.85}
                      accessibilityLabel="Focar nesta sessão"
                    >
                      <IconePixel
                        nome="clock"
                        tamanho={24}
                        cor={cores.amarelo}
                      />
                    </Pressionavel>
                  ) : null}
                </View>
              </MolduraPixel>
            </Entrada>
          );
        })}

        <View style={styles.excluir}>
          <Botao
            texto="Excluir projeto"
            variante="perigo"
            aoPressionar={excluir}
          />
        </View>
      </ScrollView>
      <JanelaHoje
        projeto={projeto}
        visivel={janelaAberta}
        aoFechar={() => setJanelaAberta(false)}
        aoFocar={(sessao) => {
          setJanelaAberta(false);
          focar(sessao);
        }}
      />
    </Tela>
  );
}

const styles = StyleSheet.create({
  cabecalho: {
    paddingHorizontal: 20,
    paddingTop: 48,
  },
  conteudo: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  resumo: {
    padding: 16,
    paddingTop: 20,
  },
  objetivo: {
    color: cores.cinzaClaro,
    fontFamily: fontes.regular,
    fontVariant: fontes.semLigaduras,
    fontSize: 15,
    marginBottom: 10,
  },
  linha: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 8,
  },
  numero: {
    color: cores.turquesa,
    fontFamily: fontes.negrito,
    fontVariant: fontes.semLigaduras,
    fontSize: 34,
  },
  total: {
    color: cores.cinzaClaro,
    fontSize: 16,
  },
  prazo: {
    color: cores.amarelo,
    fontFamily: fontes.media,
    fontVariant: fontes.semLigaduras,
    fontSize: 14,
  },
  fala: {
    color: cores.creme,
    fontFamily: fontes.regular,
    fontVariant: fontes.semLigaduras,
    fontSize: 14,
    marginTop: 12,
  },
  secao: {
    color: cores.branco,
    fontFamily: fontes.negrito,
    fontVariant: fontes.semLigaduras,
    fontSize: 20,
    marginTop: 18,
    marginBottom: 10,
  },
  etapas: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  textoEtapa: {
    color: cores.branco,
    fontFamily: fontes.media,
    fontVariant: fontes.semLigaduras,
    fontSize: 13,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  sessao: {
    marginBottom: 8,
  },
  linhaSessao: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  caixa: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  textos: {
    flex: 1,
    marginHorizontal: 12,
  },
  tituloSessao: {
    color: cores.branco,
    fontFamily: fontes.media,
    fontVariant: fontes.semLigaduras,
    fontSize: 15,
  },
  feita: {
    color: cores.cinza,
    textDecorationLine: "line-through",
  },
  dataSessao: {
    color: cores.cinzaClaro,
    fontFamily: fontes.regular,
    fontVariant: fontes.semLigaduras,
    fontSize: 12,
  },
  caixaTravada: {
    opacity: 0.6,
  },
  atrasada: {
    color: cores.vermelho,
  },
  tarefa: {
    color: cores.cinzaClaro,
    fontFamily: fontes.regular,
    fontVariant: fontes.semLigaduras,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 2,
  },
  excluir: {
    marginTop: 18,
  },
});
