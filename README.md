# Rever

## Descrição
Rever é um app de hábitos com visual pixel art. O usuário cadastra hábitos com lembretes (inclusive recorrentes, como "a cada 2h"), marca o que fez no dia e acompanha a sequência e o progresso ao longo da semana, do mês e do ano.

**Diferencial: o Revi.** Um mascote em pixel art que reage ao seu dia (dorme, fica neutro, feliz ou radiante), ganha XP a cada hábito feito e sobe de nível (no nível 5 ganha uma coroa). Dá para personalizar a cor, o acessório e o nome dele; algumas opções só abrem em níveis mais altos. Ele tem sons próprios para cada humor. Junto com 18 conquistas, transforma a rotina em um jogo.

## Aluno
Nome e RGM.

## Telas
- **Splash**: abertura do app, com acesso ao cadastro ou ao login.
- **Onboarding**: três passos de apresentação (a mesma tela, trocando o passo por parâmetro).
- **Login** e **Cadastro**: contas locais. Cada conta começa do zero e tem os seus próprios hábitos, projetos e conversas, salvos só no celular (sem servidor nem banco de dados). A senha é guardada só como hash SHA-256 com sal (`expo-crypto`).
- **Esqueceu a senha**: como não há servidor, não existe e-mail de recuperação; a tela permite apagar a conta do celular e criar outra.
- **Início**: resumo do dia, Revi com nível e XP, hábitos de hoje e de outros dias.
- **Criar Hábito** e **Editar Hábito**: formulário do hábito, com lembrete (pode repetir ao longo do dia) e "Posso começar até": a tolerância para começar. Quando o prazo está acabando, chega uma notificação com os botões "Começar agora" e "Mais tarde", e a Início mostra o aviso para começar ou adiar só hoje. Se passar do horário, chega a notificação "Passou do horário", e o app abre um popup do Revi triste para confirmar que não vai fazer hoje ou mudar o horário.
- **Agenda**: semana atual; escolha um dia para ver e marcar os hábitos dele.
- **Revi (conversa com IA)**: chat com o Revi usando o Gemini; ele faz perguntas e sugere hábitos, que entram na rotina com um toque.
- **Histórico de conversas**: ao sair do chat, a conversa vai para o histórico (por canal: rotina ou projetos). Dá para reler e continuar de onde parou. `ConversaAntiga` recebe `{ canal, id }` por parâmetro.
- **Projetos**: chat "Planejar com o Revi": você conta a ideia, ele pergunta o que falta (prazo, dias, tempo por dia) com opções prontas, mostra o plano dia a dia (o que fazer e quanto tempo) e cria o projeto com lembretes. Cada projeto tem um botão "Hoje" com o tempo de dedicação e as tarefas do dia. Detalhe do projeto recebe `{ id }` por parâmetro.
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

## IA do Revi (Gemini, grátis)
1. Crie uma chave grátis em https://aistudio.google.com/apikey.
2. Cole a chave no app (aba **Revi**) ou crie um `.env.local` a partir do `.env.example`.
   O `.env.local` não vai para o GitHub. Nunca coloque a chave em arquivos versionados.
3. Quando a cota gratuita acaba, o Revi avisa no chat e os projetos passam a ser planejados no próprio app, sem IA.

## Como executar
```bash
npm install
npx expo start
```
