import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Tela from '../components/Tela';
import PixelsDecorativos from '../components/PixelsDecorativos';
import CabecalhoTela from '../components/CabecalhoTela';
import ItemHabito from '../components/ItemHabito';
import MolduraPixel from '../components/MolduraPixel';
import Pressionavel from '../components/Pressionavel';
import Entrada from '../components/Entrada';
import { useHabitos } from '../contexto/HabitosContexto';
import { cores, fontes } from '../styles/tema';
import { chaveDia, indiceSemana, inicioDaSemana, nomesMeses, somarDias } from '../utils/datas';

const siglas = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB', 'DOM'];

export default function Agenda() {
  const { habitos, historico, alternarConcluido, projetos, alternarSessao } = useHabitos();
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
  // Sessões de projeto que o Revi marcou para este dia.
  const sessoesDoDia = projetos.flatMap((projeto) =>
    projeto.sessoes
      .filter(({ data }) => data === chaveDia(dataSelecionada))
      .map((sessao) => ({ projeto, sessao })),
  );

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
              <Entrada key={sigla} ordem={indice} tipo="escala" mola="quique" style={styles.coluna}>
                <Pressionavel
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
              </Entrada>
            );
          })}
        </View>

        <View style={styles.cabecalhoLista}>
          <Text style={styles.secao}>Hábitos do dia</Text>
          <Text style={styles.contagem}>{`${concluidos} de ${habitosDoDia.length}`}</Text>
        </View>
        {/* A chave inclui o dia: trocar de dia faz a lista entrar de novo. */}
        {habitosDoDia.map(({ id, nome, icone, lembrete, concluido }, indice) => (
          <Entrada key={`${indiceDia}-${id}`} ordem={indice + 2}>
            <ItemHabito
              nome={nome}
              icone={icone}
              detalhe={lembrete || undefined}
              concluido={concluido}
              aoMarcar={futuro ? undefined : () => alternarConcluido(id, dataSelecionada)}
            />
          </Entrada>
        ))}
        {habitosDoDia.length === 0 ? (
          <Text style={styles.vazio}>Nenhum hábito neste dia.</Text>
        ) : null}
        {futuro && habitosDoDia.length > 0 ? (
          <Text style={styles.vazio}>Dia futuro: dá para marcar quando ele chegar.</Text>
        ) : null}

        {sessoesDoDia.length > 0 ? (
          <>
            <Text style={[styles.secao, styles.secaoProjetos]}>Projetos do dia</Text>
            {sessoesDoDia.map(({ projeto, sessao }, indice) => (
              <Entrada key={`${indiceDia}-${projeto.id}-${sessao.id}`} ordem={indice + 2}>
                <ItemHabito
                  nome={sessao.titulo}
                  icone="clipboard-note"
                  detalhe={`${projeto.nome} · ${sessao.minutos} min`}
                  concluido={sessao.feita}
                  aoMarcar={futuro ? undefined : () => alternarSessao(projeto.id, sessao.id)}
                />
              </Entrada>
            ))}
          </>
        ) : null}
      </ScrollView>
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
  secaoProjetos: {
    marginTop: 18,
    marginBottom: 12,
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
