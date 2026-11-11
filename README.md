# Rever

## Descrição
Rever é um app de hábitos com visual pixel art. O usuário cadastra hábitos com lembretes (inclusive recorrentes, como "a cada 2h"), marca o que fez no dia e acompanha a sequência e o progresso ao longo da semana, do mês e do ano.

**Diferencial: o Revi.** Um mascote em pixel art que reage ao seu dia (dorme, fica neutro, feliz ou radiante), ganha XP a cada hábito feito e sobe de nível (no nível 5 ganha uma coroa). Dá para personalizar a cor, o acessório e o nome dele; algumas opções só abrem em níveis mais altos. Ele tem sons próprios para cada humor. Junto com 18 conquistas, transforma a rotina em um jogo.

## Aluno
Nome e RGM.

## Telas
- **Splash**: abertura do app, com acesso ao cadastro ou ao login.
- **Onboarding**: três passos de apresentação (a mesma tela, trocando o passo por parâmetro).
- **Login** e **Cadastro**: entrada e criação de conta.
- **Esqueceu a senha** e **Verificar e-mail**: recuperação de senha.
- **Início**: resumo do dia, Revi com nível e XP, hábitos de hoje e de outros dias.
- **Criar Hábito** e **Editar Hábito**: formulário do hábito.
- **Agenda**: semana atual; escolha um dia para ver e marcar os hábitos dele.
- **Progresso**: gráfico por semana/mês/ano, sequência atual, estatísticas e progresso por hábito.
- **Perfil**: dados do usuário, estatísticas, vitrine de conquistas e configurações.
- **Editar perfil**: nome, e-mail, avatar e cor.
- **Modo foco**: timer de foco com o Revi; ao terminar marca o hábito e dá XP extra. Recebe `{ habitoId }` por parâmetro quando aberto pelo Editar Hábito.
- **Personalizar Revi**: nome, cor, acessório e óculos (alguns liberados por nível).
- **Conquistas**: todas as conquistas com o progresso de cada uma (cabeçalho nativo configurado em `options`).

## Fonte de dados
Dados iniciais em `data/habitos.js`, `data/semana.js` e `data/conquistas.js`. O estado fica em `contexto/HabitosContexto.js` (hábitos, histórico por dia e perfil) e é salvo no aparelho com AsyncStorage. Estatísticas, XP e conquistas são calculados a partir do histórico em `utils/estatisticas.js`. Os lembretes viram notificações locais (`expo-notifications`) em `utils/lembretes.js`.

## Onde estão os requisitos
- Componentes: `components/` (Botao, CampoTexto, ItemHabito, BarraInferior, CabecalhoTela, TelaAuth, FormularioHabito, MolduraPixel, AnelProgresso, CartaoEstatistica, ...)
- Props com callback: `aoPressionar` em `components/Botao.js`, `components/ItemHabito.js` e `components/LinkTexto.js`; `aoVoltar` em `components/CabecalhoTela.js`; `aoMarcar` em `components/ItemHabito.js`; `aoSalvar` em `components/FormularioHabito.js`
- useState: hábitos, histórico e perfil em `contexto/HabitosContexto.js`, campos dos formulários em `components/FormularioHabito.js` e `screens/EditarPerfil.js`, período em `screens/Progresso.js` e dia selecionado em `screens/Agenda.js`
- useEffect: carrega e salva os dados com AsyncStorage e reagenda as notificações em `contexto/HabitosContexto.js`; esconde a splash em `App.js`; relógio com `clearInterval` em `screens/Inicio.js`; animação do Revi parada ao sair em `components/MascoteRevi.js`; aviso de conquista com `clearTimeout` em `components/AvisoConquista.js`
- Navegação com parâmetros: `screens/Inicio.js` envia `{ id }` para `screens/EditarHabito.js`, que lê com `route.params`
- Título do header em `options`: tela Conquistas em `App.js`

## Vídeo de demonstração
demo/demo.mp4

## Como executar
```bash
npm install
npx expo start
```
