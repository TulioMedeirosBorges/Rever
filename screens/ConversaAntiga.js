import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import Tela from '../components/Tela';
import CabecalhoTela from '../components/CabecalhoTela';
import MolduraPixel from '../components/MolduraPixel';
import IconePixel from '../components/IconePixel';
import Botao from '../components/Botao';
import { useHabitos } from '../contexto/HabitosContexto';
import { cores, fontes } from '../styles/tema';
import { quandoFoi } from './HistoricoChat';

// Uma conversa antiga, só para ler. Dá para continuar de onde parou ou apagar.
export default function ConversaAntiga({ navigation, route }) {
  const { canal, id } = route.params;
  const { arquivo, continuarConversa, apagarDoHistorico } = useHabitos();
  const conversa = (arquivo[canal] ?? []).find((item) => item.id === id);

  if (!conversa) {
    return null;
  }

  const continuar = () => {
    continuarConversa(canal, id);
    navigation.popToTop();
    navigation.navigate(
      'Abas',
      canal === 'projeto'
        ? { screen: 'Projetos', params: { aba: 'chat' } }
        : { screen: 'Conversar' },
    );
  };

  const apagar = () =>
    Alert.alert('Apagar conversa', 'Apagar esta conversa do histórico?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Apagar',
        style: 'destructive',
        onPress: () => {
          navigation.goBack();
          apagarDoHistorico(canal, id);
        },
      },
    ]);

  return (
    <Tela bordas={['top', 'bottom']}>
      <View style={styles.cabecalho}>
        <CabecalhoTela titulo="Conversa" mostrarVoltar aoVoltar={() => navigation.goBack()} />
        <Text style={styles.data}>{quandoFoi(conversa.data)}</Text>
      </View>
      <ScrollView contentContainerStyle={styles.conteudo} showsVerticalScrollIndicator={false}>
        {conversa.mensagens.map((mensagem) => {
          const daPessoa = mensagem.papel === 'pessoa';
          const aviso = Boolean(mensagem.tipo);
          return (
            <View key={mensagem.id} style={daPessoa ? styles.blocoPessoa : styles.blocoRevi}>
              <MolduraPixel
                corFundo={daPessoa ? cores.turquesa : aviso ? cores.cartaoDestaque : cores.creme}
                pixel={3}
              >
                <Text style={[styles.texto, aviso && styles.textoAviso]}>{mensagem.texto}</Text>
              </MolduraPixel>
              {mensagem.criado && !mensagem.desfeito ? (
                <View style={styles.nota}>
                  <IconePixel nome="check" tamanho={14} cor={cores.sucesso} />
                  <Text style={styles.textoNota}>
                    {`Criou: ${[
                      mensagem.criado.projeto?.nome,
                      ...mensagem.criado.habitos.map(({ nome }) => nome),
                    ]
                      .filter(Boolean)
                      .join(', ')}`}
                  </Text>
                </View>
              ) : null}
              {mensagem.plano ? (
                <View style={styles.nota}>
                  <IconePixel nome="clipboard-note" tamanho={14} cor={cores.turquesa} />
                  <Text style={styles.textoNota}>
                    {`Plano: ${mensagem.plano.nome} (${mensagem.plano.sessoes.length} dias)${
                      mensagem.planoCriado ? ' · criado' : ''
                    }`}
                  </Text>
                </View>
              ) : null}
            </View>
          );
        })}
      </ScrollView>
      <View style={styles.acoes}>
        <Botao texto="Continuar esta conversa" aoPressionar={continuar} />
        <Botao texto="Apagar do histórico" variante="claro" aoPressionar={apagar} />
      </View>
    </Tela>
  );
}

const styles = StyleSheet.create({
  cabecalho: {
    paddingHorizontal: 20,
    paddingTop: 48,
  },
  data: {
    color: cores.cinzaClaro,
    fontFamily: fontes.media,
    fontVariant: fontes.semLigaduras,
    fontSize: 14,
    marginTop: -14,
    marginBottom: 6,
  },
  conteudo: {
    padding: 16,
  },
  blocoRevi: {
    alignSelf: 'flex-start',
    maxWidth: '90%',
    marginBottom: 10,
  },
  blocoPessoa: {
    alignSelf: 'flex-end',
    maxWidth: '82%',
    marginBottom: 10,
  },
  texto: {
    color: cores.preto,
    fontFamily: fontes.media,
    fontVariant: fontes.semLigaduras,
    fontSize: 15,
    lineHeight: 21,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  textoAviso: {
    color: cores.branco,
  },
  nota: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
    marginLeft: 4,
  },
  textoNota: {
    flexShrink: 1,
    color: cores.cinzaClaro,
    fontFamily: fontes.media,
    fontVariant: fontes.semLigaduras,
    fontSize: 12,
  },
  acoes: {
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
});
