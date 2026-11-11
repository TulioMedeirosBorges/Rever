import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

const { AndroidHaptics, ImpactFeedbackStyle, NotificationFeedbackType } = Haptics;

// No Android usa o motor háptico do sistema; no iOS, o Taptic Engine.
const vibrar = ({ android, ios }) => {
  if (Platform.OS === 'web') {
    return;
  }
  const acao = Platform.OS === 'android' ? () => Haptics.performAndroidHapticsAsync(android) : ios;
  acao().catch(() => {});
};

export const apertar = () =>
  vibrar({
    android: AndroidHaptics.Keyboard_Press,
    ios: () => Haptics.impactAsync(ImpactFeedbackStyle.Medium),
  });

export const apertarLeve = () =>
  vibrar({
    android: AndroidHaptics.Virtual_Key,
    ios: () => Haptics.impactAsync(ImpactFeedbackStyle.Light),
  });

export const soltar = () =>
  vibrar({
    android: AndroidHaptics.Keyboard_Release,
    ios: () => Haptics.impactAsync(ImpactFeedbackStyle.Soft),
  });

export const selecao = () =>
  vibrar({
    android: AndroidHaptics.Segment_Tick,
    ios: () => Haptics.selectionAsync(),
  });

export const sucesso = () =>
  vibrar({
    android: AndroidHaptics.Confirm,
    ios: () => Haptics.notificationAsync(NotificationFeedbackType.Success),
  });

export const erro = () =>
  vibrar({
    android: AndroidHaptics.Reject,
    ios: () => Haptics.notificationAsync(NotificationFeedbackType.Error),
  });

export const vibracoes = { apertar, apertarLeve, soltar, selecao, sucesso, erro };
