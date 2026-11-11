import { useEffect } from 'react';
import { LogBox } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
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
import Conversar from './screens/Conversar';
import Projetos from './screens/Projetos';
import NovoProjeto from './screens/NovoProjeto';
import ProjetoDetalhe from './screens/ProjetoDetalhe';
import AvisoConquista from './components/AvisoConquista';
import BarraInferior from './components/BarraInferior';
import { HabitosProvider, useHabitos } from './contexto/HabitosContexto';
import { ContaProvider, useConta } from './contexto/ContaContexto';
import { cores, fontes } from './styles/tema';

SplashScreen.preventAutoHideAsync();

// No Expo Go o expo-notifications avisa que notificações *push* não existem lá.
// O app só usa notificações locais, que funcionam; os avisos só cobriam a tela.
LogBox.ignoreLogs([/expo-notifications/]);

const Stack = createNativeStackNavigator();
const Abas = createBottomTabNavigator();

// As 6 abas com a barra fixa. A troca de aba só faz um fade rápido no fundo;
// quem anima são os elementos de cada tela (componente Entrada).
function NavegacaoAbas() {
  return (
    <Abas.Navigator
      initialRouteName="Inicio"
      tabBar={(props) => <BarraInferior {...props} />}
      screenOptions={{
        headerShown: false,
        animation: 'fade',
        sceneStyle: { backgroundColor: cores.fundo },
      }}
    >
      <Abas.Screen name="Inicio" component={Inicio} />
      <Abas.Screen name="Agenda" component={Agenda} />
      <Abas.Screen name="Conversar" component={Conversar} />
      <Abas.Screen name="Projetos" component={Projetos} />
      <Abas.Screen name="Progresso" component={Progresso} />
      <Abas.Screen name="Perfil" component={Perfil} />
    </Abas.Navigator>
  );
}

const opcoesPadrao = {
  headerShown: false,
  animation: 'slide_from_right',
  contentStyle: { backgroundColor: cores.fundo },
};

function useEsconderSplash(pronto) {
  useEffect(() => {
    if (pronto) {
      SplashScreen.hideAsync();
    }
  }, [pronto]);
}

// Sem conta logada: só as telas de entrada.
function NavegacaoEntrada() {
  const { temContas } = useConta();
  useEsconderSplash(true);

  return (
    <NavigationContainer>
      {/* Quem já tem conta neste celular cai direto no login; quem é novo vê a abertura. */}
      <Stack.Navigator
        initialRouteName={temContas ? 'Login' : 'Splash'}
        screenOptions={opcoesPadrao}
      >
        <Stack.Screen name="Splash" component={Splash} options={{ animation: 'fade' }} />
        <Stack.Screen name="Onboarding" component={Onboarding} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Cadastro" component={Cadastro} />
        <Stack.Screen name="EsqueceuSenha" component={EsqueceuSenha} />
        <Stack.Screen name="VerificarEmail" component={VerificarEmail} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Com conta logada: o app inteiro, com os dados daquela conta.
function NavegacaoApp() {
  const { carregado } = useHabitos();
  useEsconderSplash(carregado);

  if (!carregado) {
    return null;
  }

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Abas"
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
            contentStyle: { backgroundColor: cores.fundo },
          }}
        >
          <Stack.Screen name="Abas" component={NavegacaoAbas} options={{ animation: 'fade' }} />
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
          <Stack.Screen
            name="NovoProjeto"
            component={NovoProjeto}
            options={{ animation: 'slide_from_bottom' }}
          />
          <Stack.Screen name="ProjetoDetalhe" component={ProjetoDetalhe} />
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

// Entrar ou sair troca de "mundo" sozinho (padrão de autenticação do React Navigation).
function Raiz({ fontesProntas }) {
  const { carregada, conta } = useConta();

  if (!fontesProntas || !carregada) {
    return null;
  }
  if (!conta) {
    return <NavegacaoEntrada />;
  }
  // A chave pela conta recria o estado do zero ao trocar de conta.
  return (
    <HabitosProvider key={conta.id} conta={conta}>
      <NavegacaoApp />
    </HabitosProvider>
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
      <ContaProvider>
        <Raiz fontesProntas={Boolean(fontesCarregadas || erroFontes)} />
      </ContaProvider>
      <StatusBar style="light" />
    </SafeAreaProvider>
  );
}
