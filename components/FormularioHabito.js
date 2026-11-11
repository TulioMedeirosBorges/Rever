import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import IconePixel from './IconePixel';
import CampoTexto from './CampoTexto';
import MolduraPixel from './MolduraPixel';
import Botao from './Botao';
import { diasSemana } from '../data/semana';
import { cores, fontes } from '../styles/tema';
import { erro as vibrarErro, selecao, toqueLeve } from '../utils/tato';

const icones = [
  'bottle-wine',
  'book-open',
  'fire',
  'sparkle',
  'notebook',
  'headphone',
  'heart',
  'coffee',
  'music',
  'moon',
];

const categorias = ['Saúde', 'Estudos', 'Bem-estar', 'Lazer', 'Trabalho'];

const formatarHorario = (texto) => {
  const digitos = texto.replace(/\D/g, '').slice(0, 4);
  return digitos.length > 2 ? `${digitos.slice(0, 2)}:${digitos.slice(2)}` : digitos;
};

const horarioValido = (horario) => {
  const partes = /^(\d{2}):(\d{2})$/.exec(horario);
  return partes !== null && Number(partes[1]) < 24 && Number(partes[2]) < 60;
};

const validar = ({ nome, frequencia, lembrete }) => {
  if (nome.trim() === '') {
    return 'Dê um nome ao hábito.';
  }
  if (frequencia.length === 0) {
    return 'Escolha pelo menos um dia.';
  }
  if (lembrete !== '' && !horarioValido(lembrete)) {
    return 'Lembrete inválido. Use o formato 19:00.';
  }
  return '';
};

export default function FormularioHabito({ valoresIniciais = {}, textoBotao, aoSalvar, children }) {
  const [nome, setNome] = useState(valoresIniciais.nome ?? '');
  const [icone, setIcone] = useState(valoresIniciais.icone ?? icones[0]);
  const [categoria, setCategoria] = useState(valoresIniciais.categoria ?? categorias[0]);
  const [frequencia, setFrequencia] = useState(valoresIniciais.frequencia ?? []);
  const [lembrete, setLembrete] = useState(valoresIniciais.lembrete ?? '');
  const [categoriasAbertas, setCategoriasAbertas] = useState(false);
  const [erro, setErro] = useState('');

  const alternarDia = (indice) => {
    selecao();
    setErro('');
    setFrequencia((atual) =>
      atual.includes(indice)
        ? atual.filter((dia) => dia !== indice)
        : [...atual, indice].sort((a, b) => a - b),
    );
  };

  const escolherCategoria = (opcao) => {
    selecao();
    setCategoria(opcao);
    setCategoriasAbertas(false);
  };

  const salvar = () => {
    const dados = { nome: nome.trim(), icone, categoria, frequencia, lembrete };
    const mensagem = validar(dados);

    if (mensagem !== '') {
      vibrarErro();
      setErro(mensagem);
      return;
    }
    aoSalvar(dados);
  };

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

      <View style={styles.icones}>
        {icones.map((opcao) => {
          const selecionado = opcao === icone;

          return (
            <TouchableOpacity
              key={opcao}
              onPress={() => {
                selecao();
                setIcone(opcao);
              }}
              activeOpacity={0.6}
              accessibilityRole="button"
              accessibilityState={{ selected: selecionado }}
            >
              <MolduraPixel
                corFundo={selecionado ? cores.roxo : cores.cartao}
                pixel={3}
                degraus={1}
                style={styles.opcaoIcone}
              >
                <IconePixel nome={opcao} tamanho={26} cor={cores.branco} />
              </MolduraPixel>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.rotulo}>Nome do hábito</Text>
      <CampoTexto
        placeholder="Ex.: Beber água"
        value={nome}
        onChangeText={(texto) => {
          setNome(texto);
          setErro('');
        }}
        maxLength={24}
        returnKeyType="done"
      />

      <Text style={styles.rotulo}>Categoria</Text>
      <TouchableOpacity
        onPress={() => {
          toqueLeve();
          setCategoriasAbertas((aberto) => !aberto);
        }}
        activeOpacity={0.7}
      >
        <MolduraPixel corFundo={cores.branco} corTopo={cores.cinzaClaro} style={styles.moldura}>
          <View style={styles.seletor}>
            <IconePixel nome={icone} tamanho={22} cor={cores.preto} />
            <Text style={styles.textoSeletor}>{categoria}</Text>
            <IconePixel
              nome={categoriasAbertas ? 'chevron-up' : 'chevron-down'}
              tamanho={24}
              cor={cores.preto}
            />
          </View>
        </MolduraPixel>
      </TouchableOpacity>
      {categoriasAbertas ? (
        <MolduraPixel corFundo={cores.branco} corTopo={cores.cinzaClaro} style={styles.lista}>
          {categorias.map((opcao) => (
            <TouchableOpacity
              key={opcao}
              style={styles.opcaoCategoria}
              onPress={() => escolherCategoria(opcao)}
              activeOpacity={0.6}
            >
              <Text style={[styles.textoSeletor, opcao === categoria && styles.categoriaAtual]}>
                {opcao}
              </Text>
              {opcao === categoria ? (
                <IconePixel nome="check" tamanho={22} cor={cores.roxo} />
              ) : null}
            </TouchableOpacity>
          ))}
        </MolduraPixel>
      ) : null}

      <Text style={styles.rotulo}>Frequência</Text>
      <View style={styles.dias}>
        {diasSemana.map((dia, indice) => {
          const selecionado = frequencia.includes(indice);

          return (
            <TouchableOpacity
              key={`${dia}-${indice}`}
              onPress={() => alternarDia(indice)}
              activeOpacity={0.6}
              hitSlop={4}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: selecionado }}
            >
              <MolduraPixel
                corFundo={selecionado ? cores.roxoClaro : cores.branco}
                corTopo={selecionado ? undefined : cores.cinzaClaro}
                pixel={3}
                degraus={1}
                style={styles.dia}
              >
                <Text style={styles.textoDia}>{dia}</Text>
              </MolduraPixel>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.rotulo}>Lembrete</Text>
      <CampoTexto
        icone="clock"
        placeholder="19:00"
        value={lembrete}
        onChangeText={(texto) => {
          setLembrete(formatarHorario(texto));
          setErro('');
        }}
        keyboardType="number-pad"
        maxLength={5}
      />

      <View style={styles.acoes}>
        {erro !== '' ? <Text style={styles.erro}>{erro}</Text> : null}
        <Botao texto={textoBotao} aoPressionar={salvar} />
        {children}
      </View>
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
    marginBottom: 16,
  },
  icones: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  opcaoIcone: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
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
  lista: {
    marginTop: -4,
    marginBottom: 12,
    paddingVertical: 4,
  },
  opcaoCategoria: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 42,
  },
  categoriaAtual: {
    color: cores.roxo,
    fontFamily: fontes.negrito,
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
  textoDia: {
    fontFamily: fontes.regular,
    fontVariant: fontes.semLigaduras,
    fontSize: 20,
    color: cores.preto,
  },
  acoes: {
    marginTop: 16,
  },
  erro: {
    color: cores.arcoIris[0],
    fontFamily: fontes.media,
    fontVariant: fontes.semLigaduras,
    fontSize: 17,
    textAlign: 'center',
    marginBottom: 4,
  },
});
