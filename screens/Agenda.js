import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Tela from '../components/Tela';
import PixelsDecorativos from '../components/PixelsDecorativos';
import CabecalhoTela from '../components/CabecalhoTela';
import ItemHabito from '../components/ItemHabito';
import MolduraPixel from '../components/MolduraPixel';
import BarraInferior from '../components/BarraInferior';
import Pressionavel from '../components/Pressionavel';
import { useHabitos } from '../contexto/HabitosContexto';
import { cores, fontes } from '../styles/tema';
import { chaveDia, indiceSemana, inicioDaSemana, nomesMeses, somarDias } from '../utils/datas';

const siglas = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB', 'DOM'];

export default function Agenda() {
  const { habitos, historico, alternarConcluido } = useHabitos();
  const hoje = new Date();
  const [indiceDia, setIndiceDia] = useState(indiceSemana(hoje));

  const segunda = inicioDaSemana(hoje);
  const semana = siglas.map((sigla, indice) => ({ sigla, data: somarDias(segunda, indice) }));
  const dataSelecionada = semana[indiceDia].data;
  const futuro = chaveDia(dataSelecionada) > chaveDia(hoje);
  const feitos = historico[chaveDia(dataSelecionada)] ?? [];
  const habitosDoDia = habitos
    .filter(({ frequencia }) => frequencia.includes(indiceDia))
    .map((habito) => ({ ...habito, concluido: feitos.includes(habito.id) }));
  const concluidos = habitosDoDia.filter(({ concluido }) => concluido).length;

  return (
    <Tela bordas={['top']}>
      <PixelsDecorativos />
      <ScrollView contentContainerStyle={styles.conteudo} showsVerticalScrollIndicator={false}>
        <CabecalhoTela titulo="Agenda" />
        <Text style={styles.mes}>{`${nomesMeses[hoje.getMonth()]} ${hoje.getFullYear()}`}</Text>

        <View style={styles.semana}>
          {semana.map(({ sigla, data }, indice) => {
            const selecionado = indice === indiceDia;
            const ehHoje = chaveDia(data) === chaveDia(hoje);
            const teveFeito = (historico[chaveDia(data)] ?? []).length > 0;

            return (
              <Pressionavel
                key={sigla}
                style={styles.coluna}
                aoPressionar={() => setIndiceDia(indice)}
                escala={0.88}
                vibracaoSoltar="selecao"
                som="navegar"
                accessibilityRole="tab"
                accessibilityState={{ selected: selecionado }}
              >
                <Text style={[styles.sigla, ehHoje && styles.siglaHoje]}>{sigla}</Text>
                <MolduraPixel
                  corFundo={selecionado ? cores.sucesso : 'transparent'}
                  pixel={3}
                  degraus={1}
                  style={styles.dia}
                >
                  <Text style={[styles.numeroDia, selecionado && styles.numeroSelecionado]}>
                    {data.getDate()}
                  </Text>
                </MolduraPixel>
                <View style={[styles.ponto, teveFeito && styles.pontoAtivo]} />
              </Pressionavel>
            );
          })}
        </View>

        <View style={styles.cabecalhoLista}>
          <Text style={styles.secao}>Hábitos do dia</Text>
          <Text style={styles.contagem}>{`${concluidos} de ${habitosDoDia.length}`}</Text>
        </View>
        {habitosDoDia.map(({ id, nome, icone, lembrete, concluido }) => (
          <ItemHabito
            key={id}
            nome={nome}
            icone={icone}
            detalhe={lembrete || undefined}
            concluido={concluido}
            aoMarcar={futuro ? undefined : () => alternarConcluido(id, dataSelecionada)}
          />
        ))}
        {habitosDoDia.length === 0 ? (
          <Text style={styles.vazio}>Nenhum hábito neste dia.</Text>
        ) : null}
        {futuro && habitosDoDia.length > 0 ? (
          <Text style={styles.vazio}>Dia futuro: dá para marcar quando ele chegar.</Text>
        ) : null}
      </ScrollView>
      <BarraInferior abaAtiva="Agenda" />
    </Tela>
  );
}

const styles = StyleSheet.create({
  conteudo: {
    padding: 20,
    paddingTop: 48,
  },
  mes: {
    color: cores.branco,
    fontSize: 30,
    fontFamily: fontes.negrito,
    fontVariant: fontes.semLigaduras,
    textAlign: 'center',
    marginTop: 32,
    marginBottom: 16,
  },
  semana: {
    flexDirection: 'row',
    marginBottom: 40,
  },
  coluna: {
    flex: 1,
    alignItems: 'center',
  },
  cabecalhoLista: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  secao: {
    color: cores.branco,
    fontFamily: fontes.negrito,
    fontVariant: fontes.semLigaduras,
    fontSize: 24,
  },
  contagem: {
    color: cores.turquesa,
    fontFamily: fontes.negrito,
    fontVariant: fontes.semLigaduras,
    fontSize: 17,
  },
  sigla: {
    color: cores.turquesa,
    fontFamily: fontes.regular,
    fontVariant: fontes.semLigaduras,
    fontSize: 19,
    marginBottom: 8,
  },
  dia: {
    width: 32,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numeroDia: {
    color: cores.branco,
    fontFamily: fontes.regular,
    fontVariant: fontes.semLigaduras,
    fontSize: 20,
  },
  numeroSelecionado: {
    color: cores.preto,
    fontFamily: fontes.negrito,
  },
  siglaHoje: {
    color: cores.hoje,
  },
  ponto: {
    width: 4,
    height: 4,
    marginTop: 4,
  },
  pontoAtivo: {
    backgroundColor: cores.laranja,
  },
  vazio: {
    color: cores.cinza,
    fontFamily: fontes.regular,
    fontVariant: fontes.semLigaduras,
    fontSize: 15,
    textAlign: 'center',
    marginVertical: 12,
  },
});
