import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import MolduraPixel from './MolduraPixel';
import IconePixel from './IconePixel';
import Botao from './Botao';
import LinkTexto from './LinkTexto';
import Pressionavel from './Pressionavel';
import Entrada from './Entrada';
import { cores, fontes } from '../styles/tema';
import { horarioLimite } from '../utils/prazos';

const adiamentos = [
  { minutos: 30, rotulo: '+30 min' },
  { minutos: 60, rotulo: '+1 h' },
  { minutos: 120, rotulo: '+2 h' },
];

// Quando o prazo para começar está acabando (ou já passou): começar agora ou adiar só hoje.
export default function JanelaPrazo({ item, visivel, aoFechar, aoComecar, aoAdiar }) {
  if (!item) {
    return null;
  }
  const limite = horarioLimite(item.horario, item.tolerancia);
  const atrasado = item.situacao === 'atrasado';
  const cor = atrasado ? cores.vermelho : cores.laranja;

  return (
    <Modal visible={visivel} transparent animationType="fade" onRequestClose={aoFechar}>
      <Pressable style={styles.fundo} onPress={aoFechar} accessibilityLabel="Fechar">
        <Pressable style={styles.janela} onPress={() => {}}>
          <Entrada tipo="escala" mola="quique">
            <MolduraPixel corFundo={cores.cartao} corTopo={cor} pixel={5}>
              <View style={styles.interno}>
                <View style={styles.linha}>
                  <IconePixel nome="alarm-clock" tamanho={26} cor={cor} />
                  <Text style={styles.titulo} numberOfLines={2}>
                    {item.nome}
                  </Text>
                </View>
                <Text style={[styles.prazo, { color: cor }]}>
                  {atrasado ? `O prazo era até ${limite}` : `Dá pra começar até ${limite}`}
                </Text>
                <Text style={styles.texto}>
                  {atrasado
                    ? 'Ainda dá tempo de fazer hoje: começa agora ou escolhe um horário mais tarde.'
                    : 'Começa agora ou, se não der, muda o horário de hoje pra mais tarde.'}
                </Text>

                <Botao texto="Começar agora" aoPressionar={aoComecar} />

                <Text style={styles.rotulo}>Fazer mais tarde (só hoje)</Text>
                <View style={styles.opcoes}>
                  {adiamentos.map(({ minutos, rotulo }) => (
                    <Pressionavel
                      key={rotulo}
                      style={styles.opcao}
                      aoPressionar={() => aoAdiar(minutos)}
                      escala={0.88}
                      vibracaoSoltar="selecao"
                      som="navegar"
                    >
                      <MolduraPixel corFundo={cores.cartaoDestaque} pixel={3} degraus={1}>
                        <Text style={styles.textoOpcao}>{rotulo}</Text>
                      </MolduraPixel>
                    </Pressionavel>
                  ))}
                </View>

                <View style={styles.fechar}>
                  <LinkTexto texto="Agora não" aoPressionar={aoFechar} />
                </View>
              </View>
            </MolduraPixel>
          </Entrada>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fundo: {
    flex: 1,
    backgroundColor: 'rgba(14, 13, 21, 0.82)',
    justifyContent: 'center',
    padding: 20,
  },
  janela: {
    width: '100%',
  },
  interno: {
    padding: 16,
    paddingTop: 20,
  },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  titulo: {
    flex: 1,
    color: cores.branco,
    fontFamily: fontes.negrito,
    fontVariant: fontes.semLigaduras,
    fontSize: 20,
  },
  prazo: {
    fontFamily: fontes.negrito,
    fontVariant: fontes.semLigaduras,
    fontSize: 22,
    marginTop: 12,
  },
  texto: {
    color: cores.cinzaClaro,
    fontFamily: fontes.regular,
    fontVariant: fontes.semLigaduras,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
    marginBottom: 8,
  },
  rotulo: {
    color: cores.branco,
    fontFamily: fontes.media,
    fontVariant: fontes.semLigaduras,
    fontSize: 14,
    marginTop: 10,
    marginBottom: 8,
  },
  opcoes: {
    flexDirection: 'row',
    gap: 8,
  },
  opcao: {
    flex: 1,
  },
  textoOpcao: {
    color: cores.branco,
    fontFamily: fontes.negrito,
    fontVariant: fontes.semLigaduras,
    fontSize: 15,
    textAlign: 'center',
    paddingVertical: 10,
  },
  fechar: {
    marginTop: 6,
  },
});
