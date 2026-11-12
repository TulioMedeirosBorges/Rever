import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import Tela from '../components/Tela';
import PixelsDecorativos from '../components/PixelsDecorativos';
import CabecalhoTela from '../components/CabecalhoTela';
import MolduraPixel from '../components/MolduraPixel';
import IconePixel from '../components/IconePixel';
import Pressionavel from '../components/Pressionavel';
import Entrada from '../components/Entrada';
import { useHabitos } from '../contexto/HabitosContexto';
import { cores, fontes } from '../styles/tema';
import { chaveDia, rotuloData } from '../utils/datas';

export const quandoFoi = (iso) => {
  const data = new Date(iso);
  const hora = `${String(data.getHours()).padStart(2, '0')}:${String(data.getMinutes()).padStart(2, '0')}`;
  return `${rotuloData(chaveDia(data))} · ${hora}`;
};

// O que o Revi criou numa conversa (para mostrar no resumo).
const criacoes = (mensagens) =>
  mensagens.reduce(
    (total, { criado, planoCriado, desfeito }) =>
      total +
      (criado && !desfeito ? criado.habitos.length + (criado.projeto ? 1 : 0) : 0) +
      (planoCriado ? 1 : 0),
    0,
  );

export default function HistoricoChat({ navigation, route }) {
  const { canal } = route.params;
  const { arquivo, apagarDoHistorico } = useHabitos();
  const conversas = arquivo[canal] ?? [];

  const apagar = (conversa) =>
    Alert.alert('Apagar conversa', `Apagar "${conversa.titulo}" do histórico?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Apagar',
        style: 'destructive',
        onPress: () => apagarDoHistorico(canal, conversa.id),
      },
    ]);

  return (
    <Tela bordas={['top', 'bottom']}>
      <PixelsDecorativos />
      <View style={styles.cabecalho}>
        <CabecalhoTela titulo="Histórico" mostrarVoltar aoVoltar={() => navigation.goBack()} />
        <Text style={styles.subtitulo}>
          {canal === 'projeto' ? 'Planejamentos de projeto' : 'Conversas com o Revi'}
        </Text>
      </View>
      <ScrollView contentContainerStyle={styles.conteudo} showsVerticalScrollIndicator={false}>
        {conversas.length === 0 ? (
          <Text style={styles.vazio}>
            Nenhuma conversa antiga ainda. Quando você sai do chat, a conversa vem para cá.
          </Text>
        ) : null}

        {conversas.map((conversa, indice) => {
          const feitas = criacoes(conversa.mensagens);
          return (
            <Entrada key={conversa.id} ordem={indice} style={styles.item}>
              <Pressionavel
                aoPressionar={() =>
                  navigation.navigate('ConversaAntiga', { canal, id: conversa.id })
                }
                escala={0.97}
              >
                <MolduraPixel corFundo={cores.cartao} pixel={3}>
                  <View style={styles.linha}>
                    <IconePixel
                      nome={canal === 'projeto' ? 'clipboard-note' : 'message-text'}
                      tamanho={22}
                      cor={canal === 'projeto' ? cores.turquesa : cores.amarelo}
                    />
                    <View style={styles.textos}>
                      <Text style={styles.titulo} numberOfLines={1}>
                        {conversa.titulo}
                      </Text>
                      <Text style={styles.detalhe}>
                        {`${quandoFoi(conversa.data)} · ${conversa.mensagens.length} mensagens${
                          feitas > 0 ? ` · criou ${feitas}` : ''
                        }`}
                      </Text>
                    </View>
                    <Pressionavel
                      aoPressionar={() => apagar(conversa)}
                      escala={0.8}
                      hitSlop={8}
                      accessibilityLabel="Apagar conversa"
                    >
                      <IconePixel nome="trash" tamanho={20} cor={cores.cinza} />
                    </Pressionavel>
                  </View>
                </MolduraPixel>
              </Pressionavel>
            </Entrada>
          );
        })}
      </ScrollView>
    </Tela>
  );
}

const styles = StyleSheet.create({
  cabecalho: {
    paddingHorizontal: 20,
    paddingTop: 48,
  },
  subtitulo: {
    color: cores.cinzaClaro,
    fontFamily: fontes.media,
    fontVariant: fontes.semLigaduras,
    fontSize: 14,
    marginTop: -14,
    marginBottom: 10,
  },
  conteudo: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  vazio: {
    color: cores.cinza,
    fontFamily: fontes.regular,
    fontVariant: fontes.semLigaduras,
    fontSize: 15,
    textAlign: 'center',
    marginTop: 30,
  },
  item: {
    marginBottom: 10,
  },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  textos: {
    flex: 1,
    marginHorizontal: 12,
  },
  titulo: {
    color: cores.branco,
    fontFamily: fontes.media,
    fontVariant: fontes.semLigaduras,
    fontSize: 16,
  },
  detalhe: {
    color: cores.cinzaClaro,
    fontFamily: fontes.regular,
    fontVariant: fontes.semLigaduras,
    fontSize: 12,
    marginTop: 2,
  },
});
