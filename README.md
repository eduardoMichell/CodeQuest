# Estudo de Caso: Desafio de Ensinar Algoritmos I

O Professor Alcemar, de uma universidade da Ilha do Silício de Florianópolis, está
buscando outros recursos didáticos para utilizar como apoio na sua disciplina de
Algoritmos. O objetivo é utilizar um recurso tecnológico que promova maior interação
entre os alunos e possua uma interface interativa. Para atingir esse objetivo, ele entrou
em contato com a sua empresa de software.

A ideia do prof. Alcemar é utilizar um jogo de quiz, cujas perguntas são relacionadas
aos conceitos de Lógica de Programação. 

O jogo terá 2 módulos: 
- Módulo Professor; 
- Módulo Aluno.

O módulo professor deve disponibilizar o relatório com o desempenho dos alunos, o
cadastro de perguntas e respostas, com o respectivo nível de dificuldade de cada
pergunta. O professor poderá criar os jogos com os níveis de dificuldade: iniciantes,
intermediário e avançado, onde as perguntas serão selecionadas aleatoriamente, ou no
modo manual, ficando a critério do professor selecionar as perguntas desejadas.
O cadastro dos alunos terá as informações de código de matrícula, nome, e-mail. 

Tanto os alunos quanto o professor devem utilizar o sistema por meio do usuário que
será um e-mail válido, e a senha deve ser alfanumérica, entre 8 e 20 carateres.

O Jogo deverá ser desenvolvido para web e ser responsivo.

No módulo Aluno, o sistema permitirá ao aluno jogar a trilha do conteúdo abordado,
neste caso é Lógica de Programação, consultar o seu desempenho no jogo e a sua
colocação em relação à turma. Também permitirá consultar as perguntas respondidas
e exportar em pdf.

Após o jogo iniciar, o sistema apresentará uma trilha de 5 fases. Em cada fase, o jogo
apresenta uma série de 4 perguntas, cada uma com 5 alternativas de respostas, e os
alunos devem escolher apenas uma resposta. As perguntas terão um time-out de 180
segundos e no final da trilha os resultados de performance de todos os alunos são
mostrados para o perfil do professor. Quando finalizar as 4 perguntas de uma fase, a
próxima fase ficará habilitada para que o usuário possa avançar na trilha. O objetivo é
passar pelas 5 fases da trilha.

O jogo deve conter recursos motivacionais para que os alunos percorram toda a trilha e
cheguem até o final.

Todos os alunos e o professor devem conseguir usar o jogo sem necessidade de
treinamento ou suporte.

Este repositório contém duas partes principais:
1. **UI em Angular**: Frontend da aplicação.
2. **API em Node.js**: Backend da aplicação.

## Pré-requisitos

Antes de começar, certifique-se de ter as seguintes ferramentas instaladas:

- [Node.js](https://nodejs.org/) (versão 20 ou superior)
- [Angular CLI](https://angular.io/cli) (versão 16 ou superior)
- [Git](https://git-scm.com/)

## Instalação

### Clonar o Repositório

```bash
git https://github.com/eduardoMichell/CodeQuest.git
cd CodeQuest
```

### Instalar Dependências

#### UI em Angular

1. Navegue até o diretório `ui`:
    ```bash
    cd ui
    ```
2. Instale as dependências:
    ```bash
    npm install
    ```
#### API em Node.js

1. Navegue até o diretório `api`:
    ```bash
    cd ../api
    ```
2. Instale as dependências:
    ```bash
    npm install
    ```
3. Crie um arquivo `local.env` no diretório `api` com o seguinte conteúdo:
    ```plaintext
    PORT=3001
    MONGO_URL=
    JWT_SECRET=
    ```
4. **OBS: Caso modifique a porta da API, altere a variável `API_URL` no `environment.ts` na UI do Angular.**
	
## Executar a Aplicação

### Executar a UI em Angular

1. Navegue até o diretório `ui`:
    ```bash
    cd ui
    ```
2. Execute o servidor de desenvolvimento:
    ```bash
    ng serve
    ```
3. Abra o navegador e acesse `http://localhost:4200`.

### Executar a API em Node.js

1. Navegue até o diretório `api`:
    ```bash
    cd ../api
    ```
2. Execute o servidor:
    ```bash
    npm start
    ```
3. A API estará disponível em `http://localhost:3001`.

## Estrutura do Projeto

```
CodeQuest/
├── api/        # Backend em Node.js
│   ├── src/
│   ├── package.json
│   └── ...
├── ui/         # Frontend em Angular
│   ├── src/
│   ├── angular.json
│   └── ...
├── README.md   # Este arquivo
└── ...
```
