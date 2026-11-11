import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Tela from '../components/Tela';
import PixelsDecorativos from '../components/PixelsDecorativos';
import CabecalhoTela from '../components/CabecalhoTela';
import MolduraPixel from '../components/MolduraPixel';
import IconePixel from '../components/IconePixel';
import CampoTexto from '../components/CampoTexto';
import Botao from '../components/Botao';
import Pressionavel from '../components/Pressionavel';
import { useHabitos } from '../contexto/HabitosContexto';
import { cores, fontes } from '../styles/tema';
import { erro as vibrarErro } from '../utils/tato';
import { tocar } from '../utils/sons';

const avatares = [
  'user',
  'human',
  'robot-face-happy',
  'alien',
  'sunglasses',
  'skull',
  'heart',
  'crown',
  'gamepad',
  'music',
];

const coresAvatar = [cores.vermelho, cores.laranja, cores.amarelo, cores.turquesa, cores.creme];

const emailValido = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default function EditarPerfil({ navigation }) {
  const { usuario, atualizarUsuario } = useHabitos();
  const [nome, setNome] = useState(usuario.nome);
  const [email, setEmail] = useState(usuario.email);
  const [avatar, setAvatar] = useState(usuario.avatar);
  const [cor, setCor] = useState(usuario.cor);
  const [erro, setErro] = useState('');

  const salvar = () => {
    if (nome.trim() === '') {
      vibrarErro();
      tocar('erro');
      setErro('Digite seu nome.');
      return;
    }
    if (!emailValido(email.trim())) {
      vibrarErro();
      tocar('erro');
      setErro('E-mail inválido.');
      return;
    }
    atualizarUsuario({ nome: nome.trim(), email: email.trim(), avatar, cor });
    navigation.goBack();
  };

  return (
    <Tela bordas={['top', 'bottom']}>
      <PixelsDecorativos />
      <View style={styles.cabecalho}>
        <CabecalhoTela titulo="Editar perfil" mostrarVoltar aoVoltar={() => navigation.goBack()} />
      </View>
      <ScrollView
        contentContainerStyle={styles.conteudo}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets
      >
        <MolduraPixel corFundo={cores.cartaoDestaque} pixel={6} style={styles.avatar}>
          <IconePixel nome={avatar} tamanho={72} cor={cor} />
        </MolduraPixel>
        <Text style={styles.previa} numberOfLines={1}>
          {nome.trim() || 'Seu nome'}
        </Text>

        <Text style={styles.rotulo}>Avatar</Text>
        <View style={styles.opcoes}>
          {avatares.map((opcao) => (
            <Pressionavel
              key={opcao}
              aoPressionar={() => setAvatar(opcao)}
              escala={0.85}
              vibracaoSoltar="selecao"
              som="navegar"
              accessibilityRole="radio"
              accessibilityState={{ selected: opcao === avatar }}
            >
              <MolduraPixel
                corFundo={opcao === avatar ? cores.sucesso : cores.cartao}
                pixel={3}
                degraus={1}
                style={styles.opcao}
              >
                <IconePixel nome={opcao} tamanho={26} cor={cores.branco} />
              </MolduraPixel>
            </Pressionavel>
          ))}
        </View>

        <Text style={styles.rotulo}>Cor</Text>
        <View style={styles.cores}>
          {coresAvatar.map((opcao) => (
            <Pressionavel
              key={opcao}
              aoPressionar={() => setCor(opcao)}
              escala={0.85}
              vibracaoSoltar="selecao"
              som="navegar"
              accessibilityRole="radio"
              accessibilityState={{ selected: opcao === cor }}
            >
              <MolduraPixel
                corFundo={opcao === cor ? cores.branco : cores.fundo}
                pixel={3}
                degraus={1}
                style={styles.bordaCor}
              >
                <MolduraPixel corFundo={opcao} pixel={3} degraus={1} style={styles.cor} />
              </MolduraPixel>
            </Pressionavel>
          ))}
        </View>

        <Text style={styles.rotulo}>Nome</Text>
        <CampoTexto
          icone="user"
          placeholder="Seu nome"
          value={nome}
          onChangeText={(texto) => {
            setNome(texto);
            setErro('');
          }}
          maxLength={18}
        />

        <Text style={styles.rotulo}>E-mail</Text>
        <CampoTexto
          icone="mail"
          placeholder="voce@email.com"
          value={email}
          onChangeText={(texto) => {
            setEmail(texto);
            setErro('');
          }}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <View style={styles.acoes}>
          {erro !== '' ? <Text style={styles.erro}>{erro}</Text> : null}
          <Botao texto="Salvar perfil" aoPressionar={salvar} />
        </View>
      </ScrollView>
    </Tela>
  );
}

const styles = StyleSheet.create({
  cabecalho: {
    paddingHorizontal: 20,
    paddingTop: 48,
  },
  conteudo: {
    paddingHorizontal: 40,
    paddingBottom: 24,
  },
  avatar: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previa: {
    color: cores.branco,
    fontFamily: fontes.negrito,
    fontVariant: fontes.semLigaduras,
    fontSize: 24,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 12,
  },
  rotulo: {
    color: cores.branco,
    fontSize: 20,
    fontFamily: fontes.negrito,
    fontVariant: fontes.semLigaduras,
    marginTop: 8,
  },
  opcoes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginVertical: 12,
  },
  opcao: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cores: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 12,
  },
  bordaCor: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cor: {
    width: 36,
    height: 36,
  },
  acoes: {
    marginTop: 16,
  },
  erro: {
    color: cores.perigo,
    fontFamily: fontes.media,
    fontVariant: fontes.semLigaduras,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 4,
  },
});
