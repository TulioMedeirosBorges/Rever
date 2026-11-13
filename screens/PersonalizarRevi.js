import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Tela from "../components/Tela";
import PixelsDecorativos from "../components/PixelsDecorativos";
import CabecalhoTela from "../components/CabecalhoTela";
import MolduraPixel from "../components/MolduraPixel";
import IconePixel from "../components/IconePixel";
import CampoTexto from "../components/CampoTexto";
import Botao from "../components/Botao";
import Pressionavel from "../components/Pressionavel";
import MascoteRevi, { ReviMiniatura } from "../components/MascoteRevi";
import { useHabitos } from "../contexto/HabitosContexto";
import { acessoriosRevi, coresRevi, rostoDe, rostosRevi } from "../data/revi";
import { cores, fontes } from "../styles/tema";
import { erro as vibrarErro } from "../utils/tato";
import { tocar } from "../utils/sons";

const humores = ["feliz", "radiante", "neutro", "dormindo"];

export default function PersonalizarRevi({ navigation }) {
  const { revi, atualizarRevi, estatisticas } = useHabitos();
  const { nivel } = estatisticas;
  const [nome, setNome] = useState(revi.nome);
  const [cor, setCor] = useState(revi.cor);
  const [acessorio, setAcessorio] = useState(revi.acessorio);
  const [rosto, setRosto] = useState(rostoDe(revi));
  const [humor, setHumor] = useState(0);
  const [aviso, setAviso] = useState("");

  const aparencia = { nome, cor, acessorio, rosto };

  // Opções bloqueadas avisam em que nível abrem.
  const escolher = (nivelNecessario, acao) => {
    if (nivel < nivelNecessario) {
      vibrarErro();
      tocar("erro");
      setAviso(
        `Libera no nível ${nivelNecessario}. Faça hábitos para ganhar XP!`,
      );
      return;
    }
    setAviso("");
    acao();
  };

  const salvar = () => {
    atualizarRevi({
      nome: nome.trim() || "Revi",
      cor,
      acessorio,
      rosto,
      oculos: undefined,
    });
    tocar("reviPulo");
    navigation.goBack();
  };

  return (
    <Tela bordas={["top", "bottom"]}>
      <PixelsDecorativos />
      <View style={styles.cabecalho}>
        <CabecalhoTela
          titulo="Personalizar"
          mostrarVoltar
          aoVoltar={() => navigation.goBack()}
        />
      </View>
      <ScrollView
        contentContainerStyle={styles.conteudo}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets
      >
        <MolduraPixel corFundo={cores.cartao} corTopo={cores.sombra} pixel={6}>
          <View style={styles.palco}>
            <MascoteRevi
              humor={humores[humor]}
              aparencia={aparencia}
              bloco={10}
              aoTocar={() => setHumor((atual) => (atual + 1) % humores.length)}
            />
            <Text style={styles.nomePrevia} numberOfLines={1}>
              {nome.trim() || "Revi"}
            </Text>
            <Text
              style={styles.dica}
            >{`Nível ${nivel} · toque nele para mudar o humor`}</Text>
          </View>
        </MolduraPixel>

        <Text style={styles.rotulo}>Nome</Text>
        <CampoTexto
          icone="heart"
          placeholder="Revi"
          value={nome}
          onChangeText={setNome}
          maxLength={10}
        />

        <Text style={styles.rotulo}>
          {"Cor "}
          <Text style={styles.escolhida}>
            {coresRevi.find(({ id }) => id === cor)?.nome ?? ""}
          </Text>
        </Text>
        <View style={styles.linhaOpcoes}>
          {coresRevi.map((opcao) => {
            const bloqueada = nivel < opcao.nivel;
            const selecionada = opcao.id === cor;

            return (
              <Pressionavel
                key={opcao.id}
                style={styles.opcaoCor}
                aoPressionar={() =>
                  escolher(opcao.nivel, () => setCor(opcao.id))
                }
                escala={0.85}
                vibracaoSoltar="selecao"
                som="navegar"
                accessibilityRole="radio"
                accessibilityState={{
                  selected: selecionada,
                  disabled: bloqueada,
                }}
                accessibilityLabel={opcao.nome}
              >
                <MolduraPixel
                  corFundo={selecionada ? cores.branco : cores.fundo}
                  pixel={3}
                  degraus={1}
                  style={styles.bordaCor}
                >
                  <MolduraPixel
                    corFundo={bloqueada ? cores.trilha : opcao.corpo}
                    pixel={3}
                    degraus={1}
                    style={styles.cor}
                  >
                    {!bloqueada && opcao.listras ? (
                      <View style={styles.listras}>
                        {opcao.listras.map((faixa) => (
                          <View
                            key={faixa}
                            style={[styles.listra, { backgroundColor: faixa }]}
                          />
                        ))}
                      </View>
                    ) : null}
                    {bloqueada ? (
                      <IconePixel nome="lock" tamanho={18} cor={cores.cinza} />
                    ) : null}
                  </MolduraPixel>
                </MolduraPixel>
                <Text style={[styles.legenda, styles.legendaBloqueada]}>
                  {bloqueada ? `NV ${opcao.nivel}` : " "}
                </Text>
              </Pressionavel>
            );
          })}
        </View>

        <Text style={styles.rotulo}>Acessório</Text>
        <View style={styles.grade}>
          {acessoriosRevi.map((opcao) => {
            const bloqueado = nivel < opcao.nivel;
            const selecionado = opcao.id === acessorio;

            return (
              <Pressionavel
                key={opcao.id}
                style={styles.opcaoAcessorio}
                aoPressionar={() =>
                  escolher(opcao.nivel, () => setAcessorio(opcao.id))
                }
                escala={0.9}
                vibracaoSoltar="selecao"
                som="navegar"
                accessibilityRole="radio"
                accessibilityState={{
                  selected: selecionado,
                  disabled: bloqueado,
                }}
                accessibilityLabel={opcao.nome}
              >
                <MolduraPixel
                  corFundo={selecionado ? cores.sucesso : cores.cartao}
                  pixel={3}
                  style={styles.cartaoAcessorio}
                >
                  <View style={[styles.miniatura, bloqueado && styles.apagado]}>
                    <ReviMiniatura
                      aparencia={{ cor, acessorio: opcao.id, rosto: "nenhum" }}
                    />
                  </View>
                  <View style={styles.linhaLegenda}>
                    {bloqueado ? (
                      <IconePixel nome="lock" tamanho={14} cor={cores.cinza} />
                    ) : null}
                    <Text
                      style={[
                        styles.legenda,
                        selecionado && styles.legendaSelecionada,
                        bloqueado && styles.legendaBloqueada,
                      ]}
                    >
                      {bloqueado ? `NV ${opcao.nivel}` : opcao.nome}
                    </Text>
                  </View>
                </MolduraPixel>
              </Pressionavel>
            );
          })}
        </View>

        <Text style={styles.rotulo}>Rosto</Text>
        <View style={styles.grade}>
          {rostosRevi.map((opcao) => {
            const bloqueado = nivel < opcao.nivel;
            const selecionado = opcao.id === rosto;

            return (
              <Pressionavel
                key={opcao.id}
                style={styles.opcaoAcessorio}
                aoPressionar={() =>
                  escolher(opcao.nivel, () => setRosto(opcao.id))
                }
                escala={0.9}
                vibracaoSoltar="selecao"
                som="navegar"
                accessibilityRole="radio"
                accessibilityState={{
                  selected: selecionado,
                  disabled: bloqueado,
                }}
                accessibilityLabel={opcao.nome}
              >
                <MolduraPixel
                  corFundo={selecionado ? cores.sucesso : cores.cartao}
                  pixel={3}
                  style={styles.cartaoAcessorio}
                >
                  <View style={[styles.miniatura, bloqueado && styles.apagado]}>
                    <ReviMiniatura
                      aparencia={{ cor, acessorio: "nenhum", rosto: opcao.id }}
                    />
                  </View>
                  <View style={styles.linhaLegenda}>
                    {bloqueado ? (
                      <IconePixel nome="lock" tamanho={14} cor={cores.cinza} />
                    ) : null}
                    <Text
                      style={[
                        styles.legenda,
                        selecionado && styles.legendaSelecionada,
                        bloqueado && styles.legendaBloqueada,
                      ]}
                    >
                      {bloqueado ? `NV ${opcao.nivel}` : opcao.nome}
                    </Text>
                  </View>
                </MolduraPixel>
              </Pressionavel>
            );
          })}
        </View>

        <View style={styles.acoes}>
          {aviso !== "" ? <Text style={styles.aviso}>{aviso}</Text> : null}
          <Botao texto="Salvar visual" aoPressionar={salvar} />
        </View>
      </ScrollView>
    </Tela>
  );
}

const styles = StyleSheet.create({
  cabecalho: {
    paddingHorizontal: 20,
    paddingTop: 48,
  },
  conteudo: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  palco: {
    alignItems: "center",
    paddingTop: 28,
    paddingBottom: 18,
  },
  nomePrevia: {
    color: cores.branco,
    fontFamily: fontes.negrito,
    fontVariant: fontes.semLigaduras,
    fontSize: 26,
    marginTop: 12,
  },
  dica: {
    color: cores.cinza,
    fontFamily: fontes.regular,
    fontVariant: fontes.semLigaduras,
    fontSize: 13,
    marginTop: 2,
  },
  rotulo: {
    color: cores.branco,
    fontSize: 20,
    fontFamily: fontes.negrito,
    fontVariant: fontes.semLigaduras,
    marginTop: 18,
  },
  escolhida: {
    color: cores.cinzaClaro,
    fontFamily: fontes.media,
    fontSize: 16,
  },
  linhaOpcoes: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 12,
  },
  listras: {
    position: "absolute",
    top: 3,
    bottom: 3,
    left: 3,
    right: 3,
  },
  listra: {
    flex: 1,
  },
  opcaoCor: {
    alignItems: "center",
  },
  bordaCor: {
    width: 46,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
  },
  cor: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
  },
  legenda: {
    color: cores.cinzaClaro,
    fontFamily: fontes.media,
    fontVariant: fontes.semLigaduras,
    fontSize: 12,
    marginTop: 4,
  },
  legendaSelecionada: {
    color: cores.preto,
  },
  legendaBloqueada: {
    color: cores.cinza,
    fontFamily: fontes.media,
    fontVariant: fontes.semLigaduras,
    fontSize: 12,
  },
  grade: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 12,
  },
  opcaoAcessorio: {
    width: "31%",
    marginBottom: 10,
  },
  cartaoAcessorio: {
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 8,
  },
  miniatura: {
    height: 42,
  },
  apagado: {
    opacity: 0.35,
  },
  linhaLegenda: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  acoes: {
    marginTop: 20,
  },
  aviso: {
    color: cores.amarelo,
    fontFamily: fontes.media,
    fontVariant: fontes.semLigaduras,
    fontSize: 15,
    textAlign: "center",
    marginBottom: 4,
  },
});
