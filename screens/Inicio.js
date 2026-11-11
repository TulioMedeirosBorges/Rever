import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Tela from '../components/Tela';
import PixelsDecorativos from '../components/PixelsDecorativos';
import IconePixel from '../components/IconePixel';
import MolduraPixel from '../components/MolduraPixel';
import FaixaArcoIris from '../components/FaixaArcoIris';
import ItemHabito from '../components/ItemHabito';
import BarraInferior from '../components/BarraInferior';
import { useHabitos } from '../contexto/HabitosContexto';
import { cores, fontes } from '../styles/tema';
import Pressionavel from '../components/Pressionavel';
import CartaoRevi from '../components/CartaoRevi';
import { horariosDoLembrete, nomesMeses, paraHorario } from '../utils/datas';
import CartaoResumo from '../components/CartaoResumo';
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

const mensagem = (concluidos, total) => {
  if (total === 0) {
    return 'Dia livre! Nenhum hábito pra hoje.';
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
  const { habitos, usuario, revi, estatisticas, alternarConcluido } = useHabitos();
  const [agora, setAgora] = useState(() => new Date());

  useEffect(() => {
    const relogio = setInterval(() => setAgora(new Date()), 60000);
    return () => clearInterval(relogio);
  }, []);

  const hoje = (agora.getDay() + 6) % 7;
  const deHoje = habitos.filter(({ frequencia }) => frequencia.includes(hoje));
  const outros = habitos.filter(({ frequencia }) => !frequencia.includes(hoje));
  const total = deHoje.length;
  const concluidos = deHoje.filter((habito) => habito.concluido).length;
  const data = `${nomesDias[agora.getDay()]}, ${agora.getDate()} de ${nomesMeses[agora.getMonth()]}`;

  // Próximo lembrete de hoje entre os hábitos que ainda faltam.
  const agoraHorario = paraHorario(agora.getHours() * 60 + agora.getMinutes());
  const proximo = deHoje
    .filter(({ concluido }) => !concluido)
    .flatMap(({ nome, ...habito }) =>
      horariosDoLembrete(habito)
        .filter((horario) => horario >= agoraHorario)
        .map((horario) => ({ nome, horario })),
    )
    .sort((a, b) => a.horario.localeCompare(b.horario))[0];

  const item = (habito) => (
    <ItemHabito
      key={habito.id}
      nome={habito.nome}
      icone={habito.icone}
      detalhe={repeticao(habito)}
      concluido={habito.concluido}
      mostrarSeta
      aoMarcar={() => alternarConcluido(habito.id)}
      aoPressionar={() => navigation.navigate('EditarHabito', { id: habito.id })}
    />
  );

  return (
    <Tela bordas={['top']}>
      <PixelsDecorativos />
      <ScrollView contentContainerStyle={styles.conteudo} showsVerticalScrollIndicator={false}>
        <View style={styles.topo}>
          <View style={styles.textosTopo}>
            <Text style={styles.data}>{data}</Text>
            <Text style={styles.ola} numberOfLines={1} adjustsFontSizeToFit>
              {`Olá, ${usuario.nome}`}
            </Text>
            <Text style={styles.subtitulo}>{mensagem(concluidos, total)}</Text>
          </View>
          <Pressionavel
            style={styles.engrenagem}
            aoPressionar={() => navigation.replace('Perfil')}
            escala={0.8}
            accessibilityLabel="Configurações"
          >
            <IconePixel nome="settings-cog" tamanho={30} cor={cores.branco} />
          </Pressionavel>
        </View>
        <FaixaArcoIris />

        <CartaoResumo
          concluidos={concluidos}
          total={total}
          semana={estatisticas.semana}
          indiceHoje={hoje}
          sequencia={estatisticas.sequenciaAtual}
          proximo={proximo}
        />

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

        <Text style={styles.secao}>Para hoje</Text>

        {deHoje.map(item)}

        {outros.length > 0 ? (
          <>
            <Text style={styles.secaoOutros}>Outros dias</Text>
            {outros.map(item)}
          </>
        ) : null}

        {habitos.length === 0 ? (
          <MolduraPixel corFundo={cores.cartao} pixel={3} style={styles.vazio}>
            <IconePixel nome="sparkle" tamanho={40} cor={cores.amarelo} />
            <Text style={styles.textoVazio}>Nenhum hábito ainda.</Text>
            <Text style={styles.dicaVazio}>Toque no + lá embaixo para criar o primeiro.</Text>
          </MolduraPixel>
        ) : null}
      </ScrollView>
      <BarraInferior abaAtiva="Inicio" />
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
