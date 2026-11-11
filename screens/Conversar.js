import Tela from '../components/Tela';
import ChatRevi from '../components/ChatRevi';
import BarraInferior from '../components/BarraInferior';
import { useHabitos } from '../contexto/HabitosContexto';
import { instrucoesConversa } from '../utils/reviIA';

const atalhos = ['Quero dormir às 23h', 'Rotina de estudo até a prova', 'Quero beber mais água'];

export default function Conversar({ navigation }) {
  const { usuario } = useHabitos();

  return (
    <Tela bordas={['top']}>
      <ChatRevi
        canal="rotina"
        navigation={navigation}
        instrucoes={instrucoesConversa}
        saudacao={`Oi, ${usuario.nome}! Me fala o que você quer: eu sugiro hábitos e, se você pedir, já crio tudo no app com lembretes.`}
        atalhos={atalhos}
        mostrarCabecalho
      />
      <BarraInferior abaAtiva="Conversar" />
    </Tela>
  );
}
