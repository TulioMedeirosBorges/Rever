import { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet, View } from "react-native";
import { cores } from "../styles/tema";
import { sucesso } from "../utils/tato";
import { tocar } from "../utils/sons";

import {
  acessoriosRevi,
  coresRevi,
  reviInicial,
  rostoDe,
  rostosRevi,
} from "../data/revi";

// Corpo do Revi sem nada na cabeça: # corpo, d sombra. As 4 primeiras linhas ficam para o acessório.
const CORPO = [
  "..............",
  "..............",
  "..............",
  "..............",
  "...########...",
  "..##########..",
  ".############.",
  ".############.",
  "##############",
  "##############",
  "##############",
  ".############.",
  "..dddddddddd..",
  "..dd......dd..",
];

export const COLUNAS_REVI = CORPO[0].length;
export const LINHAS_REVI = CORPO.length;

// Rostos: lista de [linha, coluna, tipo]. e = olho/boca, r = bochecha/língua, y = brilho.
const pontos = (linha, colunas, tipo) =>
  colunas.map((coluna) => [linha, coluna, tipo]);
const olhosAbertos = [
  ...pontos(7, [3, 4, 9, 10], "e"),
  ...pontos(8, [3, 4, 9, 10], "e"),
];

const rostos = {
  // Sobrancelhas caídas, olhos baixos, uma lágrima e a boca para baixo.
  triste: [
    ...pontos(6, [5, 8], "d"),
    ...pontos(7, [3, 4, 9, 10], "e"),
    ...pontos(8, [3, 10], "e"),
    ...pontos(9, [3], "T"),
    ...pontos(10, [3], "T"),
    ...pontos(10, [6, 7], "e"),
    ...pontos(11, [5, 8], "e"),
  ],
  dormindo: [...pontos(8, [3, 4, 9, 10], "e"), ...pontos(10, [6, 7], "e")],
  neutro: [...olhosAbertos, ...pontos(10, [5, 6, 7, 8], "e")],
  feliz: [
    ...olhosAbertos,
    ...pontos(9, [2, 11], "r"),
    ...pontos(9, [4, 9], "e"),
    ...pontos(10, [5, 6, 7, 8], "e"),
  ],
  radiante: [
    ...pontos(7, [4, 9], "e"),
    ...pontos(8, [3, 5, 8, 10], "e"),
    ...pontos(9, [2, 11], "r"),
    ...pontos(9, [5, 6, 7, 8], "e"),
    ...pontos(10, [6, 7], "r"),
    [5, 0, "y"],
    [4, 13, "y"],
    [12, 0, "y"],
  ],
};

const paleta = (corId) => {
  const { corpo, sombra } =
    coresRevi.find(({ id }) => id === corId) ?? coresRevi[0];
  return {
    l: cores.laranja,
    L: "#a8571c",
    "#": corpo,
    d: sombra,
    y: cores.amarelo,
    e: cores.fundo,
    k: cores.fundo,
    r: cores.vermelho,
    R: "#962820",
    p: cores.petroleo,
    T: cores.turquesa,
    w: cores.branco,
  };
};

const montarPixels = (humor, aparencia) => {
  const { cor, acessorio } = aparencia;
  const grade = CORPO.map((linha) => [...linha]);
  const pintar = ([linha, coluna, tipo]) => {
    grade[linha][coluna] = tipo;
  };
  rostos[humor].forEach(pintar);
  (
    rostosRevi.find(({ id }) => id === rostoDe(aparencia))?.pixels ?? []
  ).forEach(pintar);
  (acessoriosRevi.find(({ id }) => id === acessorio)?.pixels ?? []).forEach(
    pintar,
  );

  const tons = paleta(cor);
  // Cor "arco-íris": cada linha do corpo ganha uma cor da faixa da logo.
  const listras = coresRevi.find(({ id }) => id === cor)?.listras;
  const corDoPixel = (tipo, indiceLinha) =>
    tipo === "#" && listras
      ? listras[(indiceLinha - 4 + listras.length) % listras.length]
      : tons[tipo];

  return grade.flatMap((linha, indiceLinha) =>
    linha
      .map((tipo, indiceColuna) => ({
        cor: corDoPixel(tipo, indiceLinha),
        indiceLinha,
        indiceColuna,
      }))
      .filter(({ cor: corPixel }) => corPixel !== undefined),
  );
};

// Cada humor tem a sua "voz".
const vozes = {
  dormindo: "reviSono",
  neutro: "reviNeutro",
  feliz: "reviFeliz",
  radiante: "reviRadiante",
  triste: "reviTriste",
};

export const humorDoRevi = (concluidos, total) => {
  if (total === 0 || concluidos === 0) {
    return "dormindo";
  }
  if (concluidos === total) {
    return "radiante";
  }
  return concluidos / total >= 0.5 ? "feliz" : "neutro";
};

export default function MascoteRevi({
  humor,
  aparencia = reviInicial,
  bloco = 6,
  aoTocar,
}) {
  const flutuar = useRef(new Animated.Value(0)).current;
  const pulo = useRef(new Animated.Value(0)).current;

  // Fica balançando enquanto a tela está aberta; para ao sair.
  useEffect(() => {
    const animacao = Animated.loop(
      Animated.sequence([
        Animated.timing(flutuar, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(flutuar, {
          toValue: 0,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    );
    animacao.start();
    return () => animacao.stop();
  }, [flutuar]);

  const pular = () => {
    sucesso();
    tocar(vozes[humor]);
    pulo.setValue(0);
    Animated.sequence([
      Animated.timing(pulo, {
        toValue: 1,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.spring(pulo, {
        toValue: 0,
        friction: 3,
        tension: 160,
        useNativeDriver: true,
      }),
    ]).start();
    aoTocar?.();
  };

  const translateY = Animated.add(
    flutuar.interpolate({ inputRange: [0, 1], outputRange: [0, -bloco / 2] }),
    pulo.interpolate({ inputRange: [0, 1], outputRange: [0, -bloco * 4] }),
  );

  return (
    <Pressable
      onPress={pular}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel="Revi, seu mascote"
    >
      <Animated.View
        style={{
          width: COLUNAS_REVI * bloco,
          height: LINHAS_REVI * bloco,
          transform: [{ translateY }],
        }}
      >
        {montarPixels(humor, aparencia).map(
          ({ cor, indiceLinha, indiceColuna }) => (
            <View
              key={`${indiceLinha}-${indiceColuna}`}
              style={[
                styles.pixel,
                {
                  top: indiceLinha * bloco,
                  left: indiceColuna * bloco,
                  width: bloco,
                  height: bloco,
                  backgroundColor: cor,
                },
              ]}
            />
          ),
        )}
      </Animated.View>
      <View style={[styles.sombra, { width: bloco * 8, height: bloco }]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pixel: {
    position: "absolute",
  },
  sombra: {
    alignSelf: "center",
    marginTop: 2,
    backgroundColor: cores.sombra,
  },
});

// Versão parada e pequena, para miniaturas.
export function ReviMiniatura({ aparencia, humor = "feliz", bloco = 3 }) {
  return (
    <View style={{ width: COLUNAS_REVI * bloco, height: LINHAS_REVI * bloco }}>
      {montarPixels(humor, aparencia).map(
        ({ cor, indiceLinha, indiceColuna }) => (
          <View
            key={`${indiceLinha}-${indiceColuna}`}
            style={[
              styles.pixel,
              {
                top: indiceLinha * bloco,
                left: indiceColuna * bloco,
                width: bloco,
                height: bloco,
                backgroundColor: cor,
              },
            ]}
          />
        ),
      )}
    </View>
  );
}
