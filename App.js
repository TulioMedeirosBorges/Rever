import { StatusBar } from 'expo-status-bar';
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

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Splash" component={Splash} />
          <Stack.Screen name="Onboarding" component={Onboarding} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Cadastro" component={Cadastro} />
          <Stack.Screen name="EsqueceuSenha" component={EsqueceuSenha} />
          <Stack.Screen name="VerificarEmail" component={VerificarEmail} />
          <Stack.Screen name="Inicio" component={Inicio} />
          <Stack.Screen name="CriarHabito" component={CriarHabito} />
          <Stack.Screen name="EditarHabito" component={EditarHabito} />
          <Stack.Screen name="Agenda" component={Agenda} />
          <Stack.Screen name="Progresso" component={Progresso} />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="light" />
    </SafeAreaProvider>
  );
}
