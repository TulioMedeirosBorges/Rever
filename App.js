import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import {
  BitcountPropSingle_500Medium,
  BitcountPropSingle_600SemiBold,
  BitcountPropSingle_800ExtraBold,
} from '@expo-google-fonts/bitcount-prop-single';
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
    BitcountPropSingle_500Medium,
    BitcountPropSingle_600SemiBold,
    BitcountPropSingle_800ExtraBold,
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
