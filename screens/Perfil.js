import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import Tela from '../components/Tela';
import PixelsDecorativos from '../components/PixelsDecorativos';
import CabecalhoTela from '../components/CabecalhoTela';
import MolduraPixel from '../components/MolduraPixel';
import IconePixel from '../components/IconePixel';
import FaixaArcoIris from '../components/FaixaArcoIris';
import CartaoEstatistica from '../components/CartaoEstatistica';
import ItemMenu from '../components/ItemMenu';
import Botao from '../components/Botao';
import BarraInferior from '../components/BarraInferior';
import LinkTexto from '../components/LinkTexto';
import Pressionavel from '../components/Pressionavel';
import Entrada from '../components/Entrada';
import { useHabitos } from '../contexto/HabitosContexto';
import { cores, fontes } from '../styles/tema';
import { nomesMeses } from '../utils/datas';
import { chaveDoAmbiente } from '../utils/gemini';
import { useConta } from '../contexto/ContaContexto';

export default function Perfil({ navigation }) {
  const { habitos, usuario, estatisticas, conquistas, config, alternarSons, definirChaveGemini } =
    useHabitos();
  const iaConectada = Boolean(config.chaveGemini || chaveDoAmbiente);
  const { conta, sair, apagarConta } = useConta();

  // Ao sair, o app troca sozinho para a tela de login (a conta continua salva no celular).
  const confirmarSaida = () =>
    Alert.alert('Sair da conta', 'Seus dados continuam salvos neste celular.', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', onPress: sair },
    ]);

  const confirmarApagar = () =>
    Alert.alert(
      'Apagar minha conta',
      'Apaga a conta e todos os hábitos, projetos e conversas dela deste celular. Não dá para desfazer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Apagar tudo', style: 'destructive', onPress: () => apagarConta(conta.id) },
      ],
    );

  const [ano, mes] = usuario.membroDesde.split('-').map(Number);
  const abertas = conquistas.filter(({ desbloqueada }) => desbloqueada);
  // Mostra as abertas e completa com as próximas a abrir.
  const vitrine = [...abertas, ...conquistas.filter(({ desbloqueada }) => !desbloqueada)].slice(
    0,
    4,
  );
  const comLembrete = habitos.filter(({ lembrete }) => lembrete !== '').length;

  const opcoes = [
    {
      id: 'editar',
      icone: 'pencil',
      texto: 'Editar perfil',
      acao: () => navigation.navigate('EditarPerfil'),
    },
    {
      id: 'conquistas',
      icone: 'trophy',
      texto: 'Conquistas',
      detalhe: `${abertas.length}/${conquistas.length}`,
      acao: () => navigation.navigate('Conquistas'),
    },
    {
      id: 'ia',
      icone: 'robot-face-happy',
      texto: 'IA do Revi (Gemini)',
      detalhe: iaConectada ? 'Conectada' : 'Desligada',
      acao: () =>
        config.chaveGemini
          ? Alert.alert('IA do Revi', 'Desconectar a chave do Gemini deste celular?', [
              { text: 'Cancelar', style: 'cancel' },
              { text: 'Desconectar', style: 'destructive', onPress: () => definirChaveGemini('') },
            ])
          : navigation.replace('Conversar', { direcao: 'esquerda' }),
    },
    {
      id: 'sons',
      icone: config.sons ? 'volume-2' : 'volume-x',
      texto: 'Sons',
      detalhe: config.sons ? 'Ligados' : 'Desligados',
      acao: alternarSons,
    },
    {
      id: 'lembretes',
      icone: 'bell',
      texto: 'Lembretes',
      detalhe: `${comLembrete} ativos`,
      acao: () =>
        Alert.alert(
          'Lembretes',
          'Os lembretes são definidos em cada hábito. Abra um hábito na tela Início para mudar o horário ou repetir ao longo do dia.',
        ),
    },
    {
      id: 'sobre',
      icone: 'info-box',
      texto: 'Sobre o Rever',
      acao: () =>
        Alert.alert(
          'Rever',
          'Pequenos hábitos, grandes mudanças. Cada hábito feito dá XP pro Revi crescer.',
        ),
    },
  ];

  return (
    <Tela bordas={['top']}>
      <PixelsDecorativos />
      <ScrollView contentContainerStyle={styles.conteudo} showsVerticalScrollIndicator={false}>
        <CabecalhoTela titulo="Perfil" />

        <Entrada tipo="escala" mola="quique" style={styles.topo}>
          <Pressionavel
            aoPressionar={() => navigation.navigate('EditarPerfil')}
            escala={0.92}
            accessibilityLabel="Editar perfil"
          >
            <MolduraPixel corFundo={cores.cartaoDestaque} pixel={6} style={styles.avatar}>
              <IconePixel nome={usuario.avatar} tamanho={64} cor={usuario.cor} />
            </MolduraPixel>
            <MolduraPixel corFundo={cores.principal} pixel={2} degraus={1} style={styles.lapis}>
              <IconePixel nome="pencil" tamanho={18} cor={cores.preto} />
            </MolduraPixel>
          </Pressionavel>
          <Text style={styles.nome}>{usuario.nome}</Text>
          <Text style={styles.email}>{usuario.email}</Text>
          <View style={styles.faixa}>
            <FaixaArcoIris altura={4} />
          </View>
          <Text style={styles.membro}>{`Membro desde ${nomesMeses[mes - 1]} de ${ano}`}</Text>
        </Entrada>

        <Entrada ordem={2} style={styles.estatisticas}>
          <CartaoEstatistica
            icone="check"
            valor={habitos.length}
            rotulo="Hábitos ativos"
            cor={cores.turquesa}
          />
          <CartaoEstatistica
            icone="zap"
            valor={estatisticas.sequenciaAtual}
            rotulo="Dias seguidos"
            cor={cores.laranja}
          />
          <CartaoEstatistica
            icone="heart"
            valor={`NV ${estatisticas.nivel}`}
            rotulo="Nível do Revi"
            cor={cores.amarelo}
          />
        </Entrada>

        <View style={styles.linhaSecao}>
          <Text style={styles.secao}>Conquistas</Text>
          <LinkTexto texto="Ver todas" aoPressionar={() => navigation.navigate('Conquistas')} />
        </View>
        <View style={styles.conquistas}>
          {vitrine.map(({ id, icone, nome, cor, desbloqueada }, indice) => (
            <Entrada
              key={id}
              ordem={3 + indice}
              tipo="escala"
              mola="quique"
              style={styles.conquista}
            >
              <MolduraPixel
                corFundo={desbloqueada ? cores.cartaoDestaque : cores.cartao}
                pixel={4}
                style={styles.selo}
              >
                <IconePixel
                  nome={desbloqueada ? icone : 'lock'}
                  tamanho={30}
                  cor={desbloqueada ? cor : cores.cinza}
                />
              </MolduraPixel>
              <Text
                style={[styles.nomeConquista, !desbloqueada && styles.bloqueada]}
                numberOfLines={2}
              >
                {nome}
              </Text>
            </Entrada>
          ))}
        </View>

        <Text style={styles.secao}>Configurações</Text>
        {opcoes.map(({ id, icone, texto, detalhe, acao }) => (
          <ItemMenu key={id} icone={icone} texto={texto} detalhe={detalhe} aoPressionar={acao} />
        ))}

        <View style={styles.sair}>
          <Botao texto="Sair da conta" variante="claro" aoPressionar={confirmarSaida} />
          <Botao texto="Apagar minha conta" variante="perigo" aoPressionar={confirmarApagar} />
        </View>
      </ScrollView>
      <BarraInferior abaAtiva="Perfil" />
    </Tela>
  );
}

const styles = StyleSheet.create({
  conteudo: {
    padding: 20,
    paddingTop: 48,
  },
  topo: {
    alignItems: 'center',
    marginBottom: 24,
  },
  lapis: {
    position: 'absolute',
    right: -6,
    bottom: -6,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linhaSecao: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  avatar: {
    width: 104,
    height: 104,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nome: {
    color: cores.branco,
    fontFamily: fontes.negrito,
    fontVariant: fontes.semLigaduras,
    fontSize: 30,
    marginTop: 14,
  },
  email: {
    color: cores.cinza,
    fontFamily: fontes.regular,
    fontVariant: fontes.semLigaduras,
    fontSize: 16,
    marginTop: 2,
  },
  faixa: {
    width: 120,
    marginVertical: 12,
  },
  membro: {
    color: cores.branco,
    fontFamily: fontes.regular,
    fontVariant: fontes.semLigaduras,
    fontSize: 14,
  },
  estatisticas: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 28,
  },
  secao: {
    color: cores.branco,
    fontFamily: fontes.negrito,
    fontVariant: fontes.semLigaduras,
    fontSize: 26,
    marginBottom: 14,
  },
  conquistas: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  conquista: {
    alignItems: 'center',
    width: 72,
  },
  selo: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nomeConquista: {
    color: cores.branco,
    fontFamily: fontes.regular,
    fontVariant: fontes.semLigaduras,
    fontSize: 13,
    marginTop: 6,
    textAlign: 'center',
  },
  bloqueada: {
    color: cores.cinza,
  },
  sair: {
    marginTop: 12,
  },
});
