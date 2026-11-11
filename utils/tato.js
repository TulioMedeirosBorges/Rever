import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

const vibrar = (acao) => {
  if (Platform.OS === 'web') {
    return;
  }
  acao().catch(() => {});
};

export const toqueLeve = () => vibrar(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light));

export const toqueMedio = () =>
  vibrar(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium));

export const selecao = () => vibrar(() => Haptics.selectionAsync());

export const sucesso = () =>
  vibrar(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success));

export const erro = () =>
  vibrar(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error));
