import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { ACAO_COMECAR } from '../utils/lembretes';

// Trata o toque nas notificações de prazo e de atraso (inclusive com o app fechado):
// "Começar agora" abre o Modo Foco; "Mais tarde" ou tocar na notificação abre a Início
// com a janela para começar ou mudar o horário de hoje.
export default function RespostaNotificacoes({ navegacao, pronto }) {
  const pendente = useRef(null);

  const abrir = (resposta) => {
    const dados = resposta?.notification?.request?.content?.data;
    if (dados?.tipo !== 'prazo' && dados?.tipo !== 'atraso') {
      return;
    }
    if (!navegacao.isReady()) {
      pendente.current = resposta;
      return;
    }
    if (dados.tipo === 'atraso') {
      // "Passou do horário": abre a Início com o popup do Revi triste na frente.
      navegacao.navigate('Abas', { screen: 'Inicio', params: { atraso: dados.chave } });
    } else if (resposta.actionIdentifier === ACAO_COMECAR && dados.habitoId) {
      navegacao.navigate('Foco', { habitoId: dados.habitoId });
    } else if (resposta.actionIdentifier === ACAO_COMECAR && dados.sessaoId) {
      navegacao.navigate('Foco', {
        sessao: {
          projetoId: dados.projetoId,
          sessaoId: dados.sessaoId,
          minutos: dados.minutos,
          titulo: dados.titulo,
        },
      });
    } else {
      navegacao.navigate('Abas', { screen: 'Inicio', params: { prazo: dados.chave } });
    }
    // Já tratada: não pode abrir de novo da próxima vez que o app iniciar.
    Notifications.clearLastNotificationResponseAsync().catch(() => {});
  };

  useEffect(() => {
    if (Platform.OS === 'web') {
      return undefined;
    }
    const inscricao = Notifications.addNotificationResponseReceivedListener(abrir);
    Notifications.getLastNotificationResponseAsync()
      .then((resposta) => resposta && abrir(resposta))
      .catch(() => {});
    return () => inscricao.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Se a notificação chegou antes da navegação estar pronta, abre assim que ficar.
  useEffect(() => {
    if (pronto && pendente.current) {
      const resposta = pendente.current;
      pendente.current = null;
      abrir(resposta);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pronto]);

  return null;
}
