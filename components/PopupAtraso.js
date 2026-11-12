import { useEffect, useState } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import MolduraPixel from './MolduraPixel';
import MascoteRevi from './MascoteRevi';
import BalaoFala from './BalaoFala';
import Botao from './Botao';
import LinkTexto from './LinkTexto';
import Pressionavel from './Pressionavel';
import Entrada from './Entrada';
import { cores, fontes } from '../styles/tema';
import { horarioLimite } from '../utils/prazos';
import { tocar } from '../utils/sons';
import { erro as vibrarTriste } from '../utils/tato';

const opcoesDeHorario = [
  { minutos: 30, rotulo: '+30 min' },
  { minutos: 60, rotulo: '+1 h' },
  { minutos: 120, rotulo: '+2 h' },
];

// Passou do horário: o Revi aparece triste pedindo para confirmar que a pessoa não vai fazer
// a atividade hoje, ou para mudar o horário (só hoje).
export default function PopupAtraso({
  item,
  aparencia,
  visivel,
  aoFechar,
  aoPular,
  aoAdiar,
  aoComecar,
}) {
  const [mudando, setMudando] = useState(false);

  useEffect(() => {
    if (visivel) {
      setMudando(false);
      vibrarTriste();
      tocar('reviTriste');
    }
  }, [visivel]);

  if (!item) {
    return null;
  }
  const limite = horarioLimite(item.horario, item.tolerancia);

  return (
    <Modal visible={visivel} transparent animationType="fade" onRequestClose={aoFechar}>
      <View style={styles.fundo}>
        <Entrada tipo="escala" mola="quique">
          <MolduraPixel corFundo={cores.cartao} corTopo={cores.vermelho} pixel={5}>
            <View style={styles.interno}>
              <Text style={styles.titulo}>Passou do horário</Text>
              <View style={styles.conversa}>
                <MascoteRevi humor="triste" aparencia={aparencia} bloco={5} />
                <BalaoFala
                  texto={`Ei… passou do horário de ${item.nome}. Vai deixar pra lá hoje?`}
                  tamanho={14}
                />
              </View>
              <Text style={styles.detalhe}>
                {item.tolerancia > 0 ? `Era pra começar até ${limite}.` : `Era às ${item.horario}.`}
              </Text>

              {mudando ? (
                <>
                  <Text style={styles.rotulo}>Novo horário pra hoje</Text>
                  <View style={styles.opcoes}>
                    {opcoesDeHorario.map(({ minutos, rotulo }) => (
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
                </>
              ) : (
                <Botao texto="Mudar o horário" aoPressionar={() => setMudando(true)} />
              )}
              <Botao texto="Não vou fazer hoje" variante="perigo" aoPressionar={aoPular} />

              <View style={styles.links}>
                <LinkTexto texto="Vou começar agora!" aoPressionar={aoComecar} />
                <LinkTexto texto="Decidir depois" tamanho={13} aoPressionar={aoFechar} />
              </View>
            </View>
          </MolduraPixel>
        </Entrada>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fundo: {
    flex: 1,
    backgroundColor: 'rgba(14, 13, 21, 0.88)',
    justifyContent: 'center',
    padding: 18,
  },
  interno: {
    padding: 16,
    paddingTop: 20,
  },
  titulo: {
    color: cores.vermelho,
    fontFamily: fontes.negrito,
    fontVariant: fontes.semLigaduras,
    fontSize: 22,
    textAlign: 'center',
  },
  conversa: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
  },
  detalhe: {
    color: cores.cinzaClaro,
    fontFamily: fontes.regular,
    fontVariant: fontes.semLigaduras,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 4,
  },
  rotulo: {
    color: cores.branco,
    fontFamily: fontes.media,
    fontVariant: fontes.semLigaduras,
    fontSize: 14,
    marginTop: 8,
    marginBottom: 8,
  },
  opcoes: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
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
  links: {
    marginTop: 4,
  },
});
