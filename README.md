# Rever

## Descrição
Rever é um app de hábitos com visual pixel art. O usuário cadastra hábitos, marca o que fez no dia e acompanha a sequência e o progresso ao longo da semana, do mês e do ano.

## Aluno
Nome e RGM.

## Telas
- **Splash**: abertura do app, com acesso ao cadastro ou ao login.
- **Onboarding**: três passos de apresentação (a mesma tela, trocando o passo por parâmetro).
- **Login** e **Cadastro**: entrada e criação de conta.
- **Esqueceu a senha** e **Verificar e-mail**: recuperação de senha.
- **Início**: resumo do dia e lista de hábitos.
- **Criar Hábito** e **Editar Hábito**: formulário do hábito.
- **Agenda**: semana atual e hábitos do dia.
- **Progresso**: gráfico por semana/mês/ano, sequência atual, estatísticas e progresso por hábito.
- **Perfil**: dados do usuário, estatísticas, conquistas e configurações.

## Fonte de dados
Dados locais em `data/habitos.js` e `data/semana.js`. A lista de hábitos fica em estado compartilhado (`contexto/HabitosContexto.js`): marcar, criar, editar e excluir atualizam todas as telas.

## Onde estão os requisitos
- Componentes: `components/` (Botao, CampoTexto, ItemHabito, BarraInferior, CabecalhoTela, TelaAuth, FormularioHabito, MolduraPixel, AnelProgresso, CartaoEstatistica, ...)
- Props com callback: `aoPressionar` em `components/Botao.js`, `components/ItemHabito.js` e `components/LinkTexto.js`; `aoVoltar` em `components/CabecalhoTela.js`; `aoMarcar` em `components/ItemHabito.js`; `aoSalvar` em `components/FormularioHabito.js`
- useState: lista de hábitos em `contexto/HabitosContexto.js`, campos do formulário em `components/FormularioHabito.js` e período selecionado em `screens/Progresso.js`
- useEffect: esconde a splash quando as fontes carregam, em `App.js`; em `screens/Inicio.js` um relógio atualiza a data a cada minuto e é limpo com `clearInterval` ao sair da tela
- Navegação com parâmetros: `screens/Inicio.js` envia `{ id }` para `screens/EditarHabito.js`, que lê com `route.params`

## Vídeo de demonstração
demo/demo.mp4

## Como executar
```bash
npm install
npx expo start
```
