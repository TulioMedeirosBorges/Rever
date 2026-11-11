import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import IconePixel from './IconePixel';
import CampoTexto from './CampoTexto';
import MolduraPixel from './MolduraPixel';
import Botao from './Botao';
import { diasSemana } from '../data/semana';
import { cores, fontes } from '../styles/tema';
import Pressionavel from './Pressionavel';
import { erro as vibrarErro } from '../utils/tato';
import { tocar } from '../utils/sons';
import { horariosDoLembrete } from '../utils/datas';

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

const repeticoes = [
  { horas: 0, rotulo: 'Não' },
  { horas: 1, rotulo: '1h' },
  { horas: 2, rotulo: '2h' },
  { horas: 3, rotulo: '3h' },
  { horas: 4, rotulo: '4h' },
];

const formatarHorario = (texto) => {
  const digitos = texto.replace(/\D/g, '').slice(0, 4);
  return digitos.length > 2 ? `${digitos.slice(0, 2)}:${digitos.slice(2)}` : digitos;
};

const horarioValido = (horario) => {
  const partes = /^(\d{2}):(\d{2})$/.exec(horario);
  return partes !== null && Number(partes[1]) < 24 && Number(partes[2]) < 60;
};

const validar = ({ nome, frequencia, lembrete, repetir, ate }) => {
  if (nome.trim() === '') {
    return 'Dê um nome ao hábito.';
  }
  if (frequencia.length === 0) {
    return 'Escolha pelo menos um dia.';
  }
  if (lembrete !== '' && !horarioValido(lembrete)) {
    return 'Lembrete inválido. Use o formato 19:00.';
  }
  if (repetir > 0) {
    if (lembrete === '') {
      return 'Defina o horário do primeiro lembrete.';
    }
    if (!horarioValido(ate)) {
      return 'Horário final inválido. Use o formato 22:00.';
    }
    if (ate <= lembrete) {
      return 'O horário final precisa ser depois do primeiro.';
    }
  }
  return '';
};

export default function FormularioHabito({ valoresIniciais = {}, textoBotao, aoSalvar, children }) {
  const [nome, setNome] = useState(valoresIniciais.nome ?? '');
  const [icone, setIcone] = useState(valoresIniciais.icone ?? icones[0]);
  const [categoria, setCategoria] = useState(valoresIniciais.categoria ?? categorias[0]);
  const [frequencia, setFrequencia] = useState(valoresIniciais.frequencia ?? []);
  const [lembrete, setLembrete] = useState(valoresIniciais.lembrete ?? '');
  const [repetir, setRepetir] = useState(valoresIniciais.repetir ?? 0);
  const [ate, setAte] = useState(valoresIniciais.ate || '22:00');
  const [categoriasAbertas, setCategoriasAbertas] = useState(false);
  const [erro, setErro] = useState('');

  const alternarDia = (indice) => {
    setErro('');
    setFrequencia((atual) =>
      atual.includes(indice)
        ? atual.filter((dia) => dia !== indice)
        : [...atual, indice].sort((a, b) => a - b),
    );
  };

  const escolherCategoria = (opcao) => {
    setCategoria(opcao);
    setCategoriasAbertas(false);
  };

  const horarios =
    repetir > 0 && horarioValido(lembrete) && horarioValido(ate)
      ? horariosDoLembrete({ lembrete, repetir, ate })
      : [];
  const resumoLembrete =
    horarios.length > 1
      ? `${horarios.length} lembretes por dia: ${horarios.slice(0, 4).join(', ')}${
          horarios.length > 4 ? '…' : ''
        }`
      : '';

  const salvar = () => {
    const dados = {
      nome: nome.trim(),
      icone,
      categoria,
      frequencia,
      lembrete,
      repetir,
      ate: repetir > 0 ? ate : '',
    };
    const mensagem = validar(dados);

    if (mensagem !== '') {
      vibrarErro();
      tocar('erro');
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
            <Pressionavel
              key={opcao}
              aoPressionar={() => setIcone(opcao)}
              escala={0.85}
              vibracaoSoltar="selecao"
              som="navegar"
              accessibilityRole="button"
              accessibilityState={{ selected: selecionado }}
            >
              <MolduraPixel
                corFundo={selecionado ? cores.sucesso : cores.cartao}
                pixel={3}
                degraus={1}
                style={styles.opcaoIcone}
              >
                <IconePixel nome={opcao} tamanho={26} cor={cores.branco} />
              </MolduraPixel>
            </Pressionavel>
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
      <Pressionavel aoPressionar={() => setCategoriasAbertas((aberto) => !aberto)} escala={0.97}>
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
      </Pressionavel>
      {categoriasAbertas ? (
        <MolduraPixel corFundo={cores.branco} corTopo={cores.cinzaClaro} style={styles.lista}>
          {categorias.map((opcao) => (
            <Pressionavel
              key={opcao}
              style={styles.opcaoCategoria}
              aoPressionar={() => escolherCategoria(opcao)}
              escala={0.96}
              vibracaoSoltar="selecao"
              som="navegar"
            >
              <Text style={[styles.textoSeletor, opcao === categoria && styles.categoriaAtual]}>
                {opcao}
              </Text>
              {opcao === categoria ? (
                <IconePixel nome="check" tamanho={22} cor={cores.petroleo} />
              ) : null}
            </Pressionavel>
          ))}
        </MolduraPixel>
      ) : null}

      <Text style={styles.rotulo}>Frequência</Text>
      <View style={styles.dias}>
        {diasSemana.map((dia, indice) => {
          const selecionado = frequencia.includes(indice);

          return (
            <Pressionavel
              key={`${dia}-${indice}`}
              aoPressionar={() => alternarDia(indice)}
              escala={0.8}
              vibracaoSoltar="selecao"
              som="navegar"
              hitSlop={4}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: selecionado }}
            >
              <MolduraPixel
                corFundo={selecionado ? cores.sucesso : cores.branco}
                corTopo={selecionado ? undefined : cores.cinzaClaro}
                pixel={3}
                degraus={1}
                style={styles.dia}
              >
                <Text style={styles.textoDia}>{dia}</Text>
              </MolduraPixel>
            </Pressionavel>
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

      <Text style={styles.rotuloPequeno}>Repetir a cada</Text>
      <View style={styles.repeticoes}>
        {repeticoes.map(({ horas, rotulo }) => {
          const selecionado = horas === repetir;

          return (
            <Pressionavel
              key={rotulo}
              style={styles.opcaoRepetir}
              aoPressionar={() => {
                setRepetir(horas);
                setErro('');
              }}
              escala={0.85}
              vibracaoSoltar="selecao"
              som="navegar"
              accessibilityRole="radio"
              accessibilityState={{ selected: selecionado }}
            >
              <MolduraPixel
                corFundo={selecionado ? cores.sucesso : cores.cartao}
                pixel={3}
                degraus={1}
                style={styles.chip}
              >
                <Text style={[styles.textoChip, selecionado && styles.textoChipAtivo]}>
                  {rotulo}
                </Text>
              </MolduraPixel>
            </Pressionavel>
          );
        })}
      </View>

      {repetir > 0 ? (
        <>
          <Text style={styles.rotuloPequeno}>Até</Text>
          <CampoTexto
            icone="clock"
            placeholder="22:00"
            value={ate}
            onChangeText={(texto) => {
              setAte(formatarHorario(texto));
              setErro('');
            }}
            keyboardType="number-pad"
            maxLength={5}
          />
          {resumoLembrete !== '' ? <Text style={styles.resumo}>{resumoLembrete}</Text> : null}
        </>
      ) : null}

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
    color: cores.petroleo,
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
  rotuloPequeno: {
    color: cores.cinzaClaro,
    fontSize: 17,
    fontFamily: fontes.media,
    fontVariant: fontes.semLigaduras,
    marginTop: 2,
  },
  repeticoes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 12,
  },
  opcaoRepetir: {
    flex: 1,
    marginHorizontal: 3,
  },
  chip: {
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoChip: {
    color: cores.branco,
    fontFamily: fontes.media,
    fontVariant: fontes.semLigaduras,
    fontSize: 16,
  },
  textoChipAtivo: {
    color: cores.preto,
  },
  resumo: {
    color: cores.turquesa,
    fontFamily: fontes.regular,
    fontVariant: fontes.semLigaduras,
    fontSize: 14,
    marginBottom: 4,
  },
  acoes: {
    marginTop: 16,
  },
  erro: {
    color: cores.perigo,
    fontFamily: fontes.media,
    fontVariant: fontes.semLigaduras,
    fontSize: 17,
    textAlign: 'center',
    marginBottom: 4,
  },
});
