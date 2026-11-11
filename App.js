import { useEffect } from 'react';
import { LogBox } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import Splash from './screens/Splash';
import Onboarding from './screens/Onboarding';
import Login from './screens/Login';
import Cadastro from './screens/Cadastro';
import EsqueceuSenha from './screens/EsqueceuSenha';
import VerificarEmail from './screens/VerificarEmail';
import Inicio from './screens/Inicio';
import CriarHabito from './screens/CriarHabito';
import EditarHabito from './screens/EditarHabito';
import Agenda from './screens/Agenda';
import Progresso from './screens/Progresso';
import Perfil from './screens/Perfil';
import EditarPerfil from './screens/EditarPerfil';
import Conquistas from './screens/Conquistas';
import PersonalizarRevi from './screens/PersonalizarRevi';
import Foco from './screens/Foco';
import AvisoConquista from './components/AvisoConquista';
import { HabitosProvider, useHabitos } from './contexto/HabitosContexto';
import { cores, fontes } from './styles/tema';

SplashScreen.preventAutoHideAsync();

// No Expo Go o expo-notifications avisa que notificações *push* não existem lá.
// O app só usa notificações locais, que funcionam; os avisos só cobriam a tela.
LogBox.ignoreLogs([/expo-notifications/]);

const Stack = createNativeStackNavigator();

// Só mostra o app quando as fontes e os dados salvos estiverem prontos.
function Conteudo({ fontesProntas }) {
  const { carregado } = useHabitos();
  const pronto = fontesProntas && carregado;

  useEffect(() => {
    if (pronto) {
      SplashScreen.hideAsync();
    }
  }, [pronto]);

  if (!pronto) {
    return null;
  }

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={{
            headerShown: false,
            animation: 'fade',
            contentStyle: { backgroundColor: cores.fundo },
          }}
        >
          <Stack.Screen name="Splash" component={Splash} />
          <Stack.Screen name="Onboarding" component={Onboarding} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Cadastro" component={Cadastro} />
          <Stack.Screen name="EsqueceuSenha" component={EsqueceuSenha} />
          <Stack.Screen name="VerificarEmail" component={VerificarEmail} />
          <Stack.Screen name="Inicio" component={Inicio} />
          <Stack.Screen
            name="CriarHabito"
            component={CriarHabito}
            options={{ animation: 'slide_from_bottom' }}
          />
          <Stack.Screen
            name="EditarHabito"
            component={EditarHabito}
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen name="Agenda" component={Agenda} />
          <Stack.Screen name="Progresso" component={Progresso} />
          <Stack.Screen name="Perfil" component={Perfil} />
          <Stack.Screen
            name="EditarPerfil"
            component={EditarPerfil}
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="Foco"
            component={Foco}
            options={{ animation: 'slide_from_bottom', gestureEnabled: false }}
          />
          <Stack.Screen
            name="PersonalizarRevi"
            component={PersonalizarRevi}
            options={{ animation: 'slide_from_bottom' }}
          />
          <Stack.Screen
            name="Conquistas"
            component={Conquistas}
            options={{
              headerShown: true,
              title: 'Conquistas',
              animation: 'slide_from_right',
              headerStyle: { backgroundColor: cores.fundo },
              headerTintColor: cores.branco,
              headerTitleStyle: { fontFamily: fontes.negrito, fontSize: 22 },
              headerShadowVisible: false,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <AvisoConquista />
    </>
  );
}

export default function App() {
  const [fontesCarregadas, erroFontes] = useFonts({
    // Cópia local da Bitcount com a altura das letras corrigida (os acentos não são cortados no Android).
    BitcountPropSingle_500Medium: require('./assets/fontes/BitcountPropSingle_500Medium.ttf'),
    BitcountPropSingle_600SemiBold: require('./assets/fontes/BitcountPropSingle_600SemiBold.ttf'),
    BitcountPropSingle_800ExtraBold: require('./assets/fontes/BitcountPropSingle_800ExtraBold.ttf'),
  });

  return (
    <SafeAreaProvider>
      <HabitosProvider>
        <Conteudo fontesProntas={Boolean(fontesCarregadas || erroFontes)} />
      </HabitosProvider>
      <StatusBar style="light" />
    </SafeAreaProvider>
  );
}
