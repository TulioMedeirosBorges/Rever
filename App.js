import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts,
  PixelifySans_400Regular,
  PixelifySans_500Medium,
  PixelifySans_700Bold,
} from '@expo-google-fonts/pixelify-sans';
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
import { HabitosProvider } from './contexto/HabitosContexto';
import { cores } from './styles/tema';

SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontesCarregadas, erroFontes] = useFonts({
    PixelifySans_400Regular,
    PixelifySans_500Medium,
    PixelifySans_700Bold,
  });

  const pronto = fontesCarregadas || erroFontes;

  useEffect(() => {
    if (pronto) {
      SplashScreen.hideAsync();
    }
  }, [pronto]);

  if (!pronto) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <HabitosProvider>
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
          </Stack.Navigator>
        </NavigationContainer>
      </HabitosProvider>
      <StatusBar style="light" />
    </SafeAreaProvider>
  );
}
