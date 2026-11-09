import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from './screens/Home';
import Detalhes from './screens/Detalhes';
import Formulario from './screens/Formulario';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} options={{ title: 'Início' }} />
        <Stack.Screen
          name="Detalhes"
          component={Detalhes}
          options={({ route }) => ({ title: route.params?.titulo ?? 'Detalhes' })}
        />
        <Stack.Screen name="Formulario" component={Formulario} options={{ title: 'Formulário' }} />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
