import { useState } from 'react';
import { Alert, StyleSheet, Text } from 'react-native';
import TelaAuth from '../components/TelaAuth';
import CampoTexto from '../components/CampoTexto';
import Botao from '../components/Botao';
import LinkTexto from '../components/LinkTexto';
import { ErroFormulario } from '../components/AvisoConta';
import { useConta } from '../contexto/ContaContexto';
import { cores, fontes } from '../styles/tema';
import { erro as vibrarErro } from '../utils/tato';
import { tocar } from '../utils/sons';

// As contas ficam só neste celular, sem servidor: não há como mandar e-mail de recuperação.
// A saída é apagar a conta (e os dados dela) deste aparelho e criar de novo.
export default function EsqueceuSenha({ navigation }) {
  const { contaPorEmail, apagarConta } = useConta();
  const [email, setEmail] = useState('');
  const [erro, setErro] = useState('');

  const recomecar = () => {
    const conta = contaPorEmail(email);
    if (!conta) {
      vibrarErro();
      tocar('erro');
      setErro('Não tem conta com esse e-mail neste celular.');
      return;
    }
    Alert.alert(
      'Apagar e recomeçar',
      `Isso apaga a conta ${conta.email} e todos os hábitos, projetos e conversas dela deste celular. Não dá para desfazer.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Apagar',
          style: 'destructive',
          onPress: async () => {
            await apagarConta(conta.id);
            navigation.replace('Cadastro');
          },
        },
      ],
    );
  };

  return (
    <TelaAuth titulo="Esqueceu sua senha" subtitulo="Sua conta fica só neste celular">
      <Text style={styles.texto}>
        Como nada vai para um servidor, não dá para mandar um e-mail de recuperação. Se você não
        lembra a senha, pode apagar a conta deste celular e criar outra.
      </Text>
      <CampoTexto
        icone="mail"
        placeholder="E-mail da conta"
        value={email}
        onChangeText={(texto) => {
          setEmail(texto);
          setErro('');
        }}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <ErroFormulario texto={erro} />
      <Botao texto="Apagar e recomeçar" variante="perigo" aoPressionar={recomecar} />
      <LinkTexto texto="Lembrei! Voltar a entrar" aoPressionar={() => navigation.popTo('Login')} />
    </TelaAuth>
  );
}

const styles = StyleSheet.create({
  texto: {
    color: cores.cinzaClaro,
    fontFamily: fontes.regular,
    fontVariant: fontes.semLigaduras,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 6,
  },
});
