import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Tela from '../components/Tela';
import PixelsDecorativos from '../components/PixelsDecorativos';
import IconePixel from '../components/IconePixel';
import MolduraPixel from '../components/MolduraPixel';
import FaixaArcoIris from '../components/FaixaArcoIris';
import ItemHabito from '../components/ItemHabito';
import { useHabitos } from '../contexto/HabitosContexto';
import { cores, fontes } from '../styles/tema';
import Pressionavel from '../components/Pressionavel';
import CartaoRevi from '../components/CartaoRevi';
import {
  chaveDia,
  horariosDoLembrete,
  indiceSemana,
  nomesMeses,
  paraHorario,
  somarDias,
} from '../utils/datas';
import { formatarDuracao } from '../utils/reviIA';
import { JanelaHoje } from '../components/HojeNoProjeto';
import CartaoResumo from '../components/CartaoResumo';
import Entrada from '../components/Entrada';
import { XP_POR_FOCO } from '../utils/estatisticas';

const nomesDias = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];

const repeticao = ({ categoria, lembrete, repetir }) => {
  if (!lembrete) {
    return categoria;
  }
  return repetir > 0
    ? `${categoria} · ${lembrete} · a cada ${repetir}h`
    : `${categoria} · ${lembrete}`;
};

const mensagem = (concluidos, total, sessoesPendentes) => {
  if (total === 0) {
    return sessoesPendentes > 0
      ? 'Hoje é dia de focar no projeto!'
      : 'Dia livre! Nenhum hábito pra hoje.';
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
  const { habitos, projetos, usuario, revi, estatisticas, alternarConcluido, alternarSessao } =
    useHabitos();
  const [projetoAberto, setProjetoAberto] = useState(null);
  const [diaFuturo, setDiaFuturo] = useState(1);
  const [agora, setAgora] = useState(() => new Date());

  useEffect(() => {
    const relogio = setInterval(() => setAgora(new Date()), 60000);
    return () => clearInterval(relogio);
  }, []);

  const hoje = (agora.getDay() + 6) % 7;
  const deHoje = habitos.filter(({ frequencia }) => frequencia.includes(hoje));
  const total = deHoje.length;
  const concluidos = deHoje.filter((habito) => habito.concluido).length;
  const data = `${nomesDias[agora.getDay()]}, ${agora.getDate()} de ${nomesMeses[agora.getMonth()]}`;

  // Sessões de projeto marcadas para hoje: entram na lista "Para hoje" para lembrar.
  const sessoesHoje = projetos.flatMap((projeto) =>
    projeto.sessoes
      .filter(({ data }) => data === chaveDia(agora))
      .map((sessao) => ({ projeto, sessao })),
  );
  const sessoesPendentes = sessoesHoje.filter(({ sessao }) => !sessao.feita).length;

  // Hábitos e sessões de hoje juntos, em ordem de horário (sem horário vai para o fim).
  const paraHoje = [
    ...deHoje.map((habito) => ({
      tipo: 'habito',
      chave: `h${habito.id}`,
      horario: habito.lembrete,
      habito,
    })),
    ...sessoesHoje.map(({ projeto, sessao }) => ({
      tipo: 'sessao',
      chave: `s${projeto.id}-${sessao.id}`,
      horario: projeto.horario ?? '',
      projeto,
      sessao,
    })),
  ].sort((a, b) => (a.horario || '99:99').localeCompare(b.horario || '99:99'));

  // Próximo lembrete de hoje entre os hábitos e sessões que ainda faltam.
  const agoraHorario = paraHorario(agora.getHours() * 60 + agora.getMinutes());
  const proximo = [
    ...deHoje
      .filter(({ concluido }) => !concluido)
      .flatMap(({ nome, ...habito }) =>
        horariosDoLembrete(habito).map((horario) => ({ nome, horario })),
      ),
    ...sessoesHoje
      .filter(({ sessao, projeto }) => !sessao.feita && projeto.horario)
      .map(({ projeto }) => ({ nome: projeto.nome, horario: projeto.horario })),
  ]
    .filter(({ horario }) => horario >= agoraHorario)
    .sort((a, b) => a.horario.localeCompare(b.horario))[0];

  // Próximos 7 dias: hábitos e sessões de cada um, em ordem de horário.
  const siglas = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
  const itensDoDia = (data) =>
    [
      ...habitos
        .filter(({ frequencia }) => frequencia.includes(indiceSemana(data)))
        .map((habito) => ({
          tipo: 'habito',
          chave: `h${habito.id}`,
          horario: habito.lembrete,
          habito,
        })),
      ...projetos.flatMap((projeto) =>
        projeto.sessoes
          .filter(({ data: diaSessao }) => diaSessao === chaveDia(data))
          .map((sessao) => ({
            tipo: 'sessao',
            chave: `s${projeto.id}-${sessao.id}`,
            horario: projeto.horario ?? '',
            projeto,
            sessao,
          })),
      ),
    ].sort((a, b) => (a.horario || '99:99').localeCompare(b.horario || '99:99'));
  const proximosDias = Array.from({ length: 7 }, (_, posicao) => {
    const distancia = posicao + 1;
    const data = somarDias(agora, distancia);
    return {
      distancia,
      rotulo: distancia === 1 ? 'Amanhã' : `${siglas[data.getDay()]} ${data.getDate()}`,
      itens: itensDoDia(data),
    };
  });
  const diaEscolhido = proximosDias[diaFuturo - 1];

  const focarSessao = (projeto, sessao) => {
    setProjetoAberto(null);
    navigation.navigate('Foco', {
      sessao: {
        projetoId: projeto.id,
        sessaoId: sessao.id,
        minutos: sessao.minutos,
        titulo: `${projeto.nome}: ${sessao.titulo}`,
      },
    });
  };

  const itemSessao = ({ chave, projeto, sessao }, indice) => (
    <Entrada key={chave} ordem={5 + indice}>
      <ItemHabito
        nome={sessao.titulo}
        icone={projeto.icone ?? 'clipboard-note'}
        cor={projeto.cor ?? cores.turquesa}
        etiqueta="PROJETO"
        detalhe={`${projeto.nome} · ${formatarDuracao(sessao.minutos)}${
          projeto.horario ? ` · ${projeto.horario}` : ''
        }`}
        concluido={sessao.feita}
        mostrarSeta
        aoMarcar={() => alternarSessao(projeto.id, sessao.id)}
        aoPressionar={() => setProjetoAberto(projeto.id)}
      />
    </Entrada>
  );

  const item = (habito, indice) => (
    <Entrada key={habito.id} ordem={5 + indice}>
      <ItemHabito
        nome={habito.nome}
        icone={habito.icone}
        detalhe={repeticao(habito)}
        concluido={habito.concluido}
        mostrarSeta
        aoMarcar={() => alternarConcluido(habito.id)}
        aoPressionar={() => navigation.navigate('EditarHabito', { id: habito.id })}
      />
    </Entrada>
  );

  return (
    <Tela bordas={['top']}>
      <PixelsDecorativos />
      <ScrollView contentContainerStyle={styles.conteudo} showsVerticalScrollIndicator={false}>
        <Entrada tipo="esquerda" style={styles.topo}>
          <View style={styles.textosTopo}>
            <Text style={styles.data}>{data}</Text>
            <Text style={styles.ola} numberOfLines={1} adjustsFontSizeToFit>
              {`Olá, ${usuario.nome}`}
            </Text>
            <Text style={styles.subtitulo}>{mensagem(concluidos, total, sessoesPendentes)}</Text>
          </View>
          <Pressionavel
            style={styles.engrenagem}
            aoPressionar={() => navigation.navigate('Perfil')}
            escala={0.8}
            accessibilityLabel="Configurações"
          >
            <IconePixel nome="settings-cog" tamanho={30} cor={cores.branco} />
          </Pressionavel>
        </Entrada>
        <FaixaArcoIris />

        <Entrada ordem={1}>
          <CartaoResumo
            concluidos={concluidos}
            total={total}
            semana={estatisticas.semana}
            indiceHoje={hoje}
            sequencia={estatisticas.sequenciaAtual}
            proximo={proximo}
          />
        </Entrada>

        <Entrada ordem={2}>
          <CartaoRevi
            concluidos={concluidos}
            total={total}
            nivel={estatisticas.nivel}
            xpNoNivel={estatisticas.xpNoNivel}
            sequencia={estatisticas.sequenciaAtual}
            proximo={proximo}
            nomeUsuario={usuario.nome}
            aparencia={revi}
            aoPersonalizar={() => navigation.navigate('PersonalizarRevi')}
          />
        </Entrada>

        <Entrada ordem={3} tipo="escala">
          <Pressionavel
            aoPressionar={() => navigation.navigate('Foco')}
            escala={0.97}
            accessibilityRole="button"
            accessibilityLabel="Abrir modo foco"
          >
            <MolduraPixel corFundo={cores.cartaoDestaque} pixel={4} style={styles.molduraFoco}>
              <View style={styles.foco}>
                <MolduraPixel corFundo={cores.fundo} pixel={3} degraus={1} style={styles.seloFoco}>
                  <IconePixel nome="clock" tamanho={26} cor={cores.amarelo} />
                </MolduraPixel>
                <View style={styles.textosFoco}>
                  <Text style={styles.tituloFoco}>Modo foco</Text>
                  <Text style={styles.detalheFoco}>
                    {`Foque com o ${revi.nome} e ganhe +${XP_POR_FOCO} XP`}
                  </Text>
                </View>
                <IconePixel nome="chevron-right-2" tamanho={30} cor={cores.cinzaClaro} />
              </View>
            </MolduraPixel>
          </Pressionavel>
        </Entrada>

        <Entrada ordem={4} tipo="esquerda">
          <Text style={styles.secao}>Para hoje</Text>
        </Entrada>

        {paraHoje.map((entrada, indice) =>
          entrada.tipo === 'habito' ? item(entrada.habito, indice) : itemSessao(entrada, indice),
        )}

        {habitos.length > 0 || projetos.length > 0 ? (
          <>
            <Text style={styles.secaoOutros}>Próximos dias</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.diasFuturos}
            >
              {proximosDias.map(({ distancia, rotulo, itens }) => {
                const ativo = distancia === diaFuturo;
                return (
                  <Pressionavel
                    key={distancia}
                    aoPressionar={() => setDiaFuturo(distancia)}
                    escala={0.88}
                    vibracaoSoltar="selecao"
                    som="navegar"
                    accessibilityRole="tab"
                    accessibilityState={{ selected: ativo }}
                  >
                    <MolduraPixel
                      corFundo={ativo ? cores.sucesso : cores.cartao}
                      pixel={3}
                      degraus={1}
                      style={styles.chipDia}
                    >
                      <Text style={[styles.textoChipDia, ativo && styles.textoChipAtivo]}>
                        {rotulo}
                      </Text>
                      <Text style={[styles.contagemDia, ativo && styles.textoChipAtivo]}>
                        {itens.length === 0
                          ? 'livre'
                          : `${itens.length} ${itens.length === 1 ? 'item' : 'itens'}`}
                      </Text>
                    </MolduraPixel>
                  </Pressionavel>
                );
              })}
            </ScrollView>

            {diaEscolhido.itens.map((entrada, indice) =>
              entrada.tipo === 'habito' ? (
                <Entrada key={`${diaFuturo}-${entrada.chave}`} ordem={indice}>
                  <ItemHabito
                    nome={entrada.habito.nome}
                    icone={entrada.habito.icone}
                    detalhe={repeticao(entrada.habito)}
                    mostrarSeta
                    aoPressionar={() =>
                      navigation.navigate('EditarHabito', { id: entrada.habito.id })
                    }
                  />
                </Entrada>
              ) : (
                <Entrada key={`${diaFuturo}-${entrada.chave}`} ordem={indice}>
                  <ItemHabito
                    nome={entrada.sessao.titulo}
                    icone={entrada.projeto.icone ?? 'clipboard-note'}
                    cor={entrada.projeto.cor ?? cores.turquesa}
                    etiqueta="PROJETO"
                    detalhe={`${entrada.projeto.nome} · ${formatarDuracao(entrada.sessao.minutos)}${
                      entrada.projeto.horario ? ` · ${entrada.projeto.horario}` : ''
                    }`}
                    concluido={entrada.sessao.feita}
                    mostrarSeta
                    aoPressionar={() =>
                      navigation.navigate('ProjetoDetalhe', { id: entrada.projeto.id })
                    }
                  />
                </Entrada>
              ),
            )}
            {diaEscolhido.itens.length === 0 ? (
              <Text style={styles.diaLivre}>Nada marcado para esse dia. Aproveita!</Text>
            ) : null}
          </>
        ) : null}

        {habitos.length === 0 && sessoesHoje.length === 0 ? (
          <MolduraPixel corFundo={cores.cartao} pixel={3} style={styles.vazio}>
            <IconePixel nome="sparkle" tamanho={40} cor={cores.amarelo} />
            <Text style={styles.textoVazio}>Nenhum hábito ainda.</Text>
            <Text style={styles.dicaVazio}>Toque no + lá embaixo para criar o primeiro.</Text>
          </MolduraPixel>
        ) : null}
      </ScrollView>
      <JanelaHoje
        projeto={projetos.find(({ id }) => id === projetoAberto) ?? null}
        visivel={Boolean(projetoAberto)}
        aoFechar={() => setProjetoAberto(null)}
        aoFocar={(sessao) =>
          focarSessao(
            projetos.find(({ id }) => id === projetoAberto),
            sessao,
          )
        }
      />
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
    color: cores.turquesa,
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
  diasFuturos: {
    gap: 8,
    paddingBottom: 12,
  },
  chipDia: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    alignItems: 'center',
  },
  textoChipDia: {
    color: cores.branco,
    fontFamily: fontes.negrito,
    fontVariant: fontes.semLigaduras,
    fontSize: 14,
  },
  contagemDia: {
    color: cores.cinzaClaro,
    fontFamily: fontes.regular,
    fontVariant: fontes.semLigaduras,
    fontSize: 11,
  },
  textoChipAtivo: {
    color: cores.preto,
  },
  diaLivre: {
    color: cores.cinza,
    fontFamily: fontes.regular,
    fontVariant: fontes.semLigaduras,
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 12,
  },
  secaoOutros: {
    color: cores.cinzaClaro,
    fontSize: 18,
    fontFamily: fontes.negrito,
    fontVariant: fontes.semLigaduras,
    marginTop: 12,
    marginBottom: 12,
  },
  secao: {
    color: cores.branco,
    fontSize: 24,
    fontFamily: fontes.negrito,
    fontVariant: fontes.semLigaduras,
    marginBottom: 12,
  },
  molduraFoco: {
    marginBottom: 26,
  },
  foco: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    paddingTop: 14,
  },
  seloFoco: {
    width: 46,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textosFoco: {
    flex: 1,
    marginLeft: 12,
  },
  tituloFoco: {
    color: cores.branco,
    fontFamily: fontes.negrito,
    fontVariant: fontes.semLigaduras,
    fontSize: 19,
  },
  detalheFoco: {
    color: cores.cinzaClaro,
    fontFamily: fontes.regular,
    fontVariant: fontes.semLigaduras,
    fontSize: 13,
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
