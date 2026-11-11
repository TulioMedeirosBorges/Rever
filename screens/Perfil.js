import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Tela from '../components/Tela';
import PixelsDecorativos from '../components/PixelsDecorativos';
import CabecalhoTela from '../components/CabecalhoTela';
import MolduraPixel from '../components/MolduraPixel';
import IconeProprio from '../components/IconeProprio';
import IconePixel from '../components/IconePixel';
import FaixaArcoIris from '../components/FaixaArcoIris';
import CartaoEstatistica from '../components/CartaoEstatistica';
import ItemMenu from '../components/ItemMenu';
import Botao from '../components/Botao';
import BarraInferior from '../components/BarraInferior';
import { useHabitos } from '../contexto/HabitosContexto';
import { cores, fontes } from '../styles/tema';

const conquistas = [
  { id: 1, icone: 'fire', nome: '7 dias', cor: cores.arcoIris[1], desbloqueada: true },
  { id: 2, icone: 'trophy', nome: '1º hábito', cor: cores.amarelo, desbloqueada: true },
  { id: 3, icone: 'star', nome: '50 feitos', cor: cores.arcoIris[3], desbloqueada: true },
  { id: 4, icone: 'crown', nome: '30 dias', cor: cores.roxo, desbloqueada: false },
];

const opcoes = [
  { id: 1, icone: 'pencil', texto: 'Editar perfil' },
  { id: 2, icone: 'bell', texto: 'Notificações', detalhe: 'Ativadas' },
  { id: 3, icone: 'clock', texto: 'Lembretes', detalhe: '19:00' },
  { id: 4, icone: 'info-box', texto: 'Sobre o Rever' },
];

export default function Perfil({ navigation }) {
  const { habitos } = useHabitos();
  const sair = () => navigation.reset({ index: 0, routes: [{ name: 'Login' }] });

  return (
    <Tela bordas={['top']}>
      <PixelsDecorativos />
      <ScrollView contentContainerStyle={styles.conteudo} showsVerticalScrollIndicator={false}>
        <CabecalhoTela titulo="Perfil" />

        <View style={styles.topo}>
          <MolduraPixel corFundo={cores.cartaoDestaque} pixel={6} style={styles.avatar}>
            <IconeProprio nome="usuario" tamanho={56} cor={cores.branco} />
          </MolduraPixel>
          <Text style={styles.nome}>Usuário</Text>
          <Text style={styles.email}>usuario@email.com</Text>
          <View style={styles.faixa}>
            <FaixaArcoIris altura={4} />
          </View>
          <Text style={styles.membro}>Membro desde novembro de 2026</Text>
        </View>

        <View style={styles.estatisticas}>
          <CartaoEstatistica icone="check" valor={habitos.length} rotulo="Hábitos ativos" cor={cores.roxo} />
          <CartaoEstatistica icone="zap" valor="5" rotulo="Dias seguidos" cor={cores.arcoIris[1]} />
          <CartaoEstatistica icone="trophy" valor="3" rotulo="Conquistas" cor={cores.amarelo} />
        </View>

        <Text style={styles.secao}>Conquistas</Text>
        <View style={styles.conquistas}>
          {conquistas.map(({ id, icone, nome, cor, desbloqueada }) => (
            <View key={id} style={styles.conquista}>
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
              <Text style={[styles.nomeConquista, !desbloqueada && styles.bloqueada]}>{nome}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.secao}>Configurações</Text>
        {opcoes.map(({ id, icone, texto, detalhe }) => (
          <ItemMenu key={id} icone={icone} texto={texto} detalhe={detalhe} />
        ))}

        <View style={styles.sair}>
          <Botao texto="Sair da conta" variante="perigo" aoPressionar={sair} />
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
