import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TrackDialogComponent } from 'src/app/dialogs/track-dialog/track-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private selectedGame: any = null;
  private phasesStatus: any = [];
  private selectedPhaseIndex: number | null = null;
  private selectedQuestionIndex: number = 0;
  private answers: any = []; // Array para armazenar as respostas de cada fase

  constructor(private dialog: MatDialog) {
  }

  setSelectedGame(game: any) {
    this.selectedGame = {
      theme: 'Programação',
      createdBy: 'Professor Tech',
      difficulty: 'Fácil',
      phases: [
        {
          questions: [
            {
              question: 'Qual das seguintes opções melhor descreve a utilização de uma estrutura de controle condicional em programação?',
              options: [
                'Permite que o programa execute diferentes seções de código, dependendo se uma condição específica é verdadeira ou falsa.',
                'Usada para repetir um bloco de código um número específico de vezes.',
                'Permite a execução de operações matemáticas e lógicas.',
                'Usada para declarar e inicializar variáveis.',
                'Permite a interrupção do fluxo normal do programa e a transferência de execução para um tratador de exceção.'
              ],
              answer: 0,
              rate: 10,
              time: 300 // 5 minutes
            },
            {
              question: 'Qual é o resultado da expressão "2 + 2 * 2" em linguagens de programação com precedência de operadores padrão?',
              options: [
                '4',
                '6',
                '8',
                '10',
                '12'
              ],
              answer: 1,
              rate: 10,
              time: 300 // 5 minutes
            },
            {
              question: 'Qual das seguintes opções não é uma linguagem de programação?',
              options: [
                'Python',
                'Java',
                'HTML',
                'C++',
                'JavaScript'
              ],
              answer: 2,
              rate: 10,
              time: 300 // 5 minutes
            },
            {
              question: 'O que significa "SQL" em programação?',
              options: [
                'Sequential Query Language',
                'Structured Query Language',
                'Simple Query Language',
                'Scripted Query Language',
                'None of the above'
              ],
              answer: 1,
              rate: 10,
              time: 300 // 5 minutes
            },
            {
              question: 'Qual é a função principal do "Git" em desenvolvimento de software?',
              options: [
                'Compilar código fonte',
                'Gerenciar dependências de projeto',
                'Controlar versões de código',
                'Automatizar testes de unidade',
                'Implantar aplicativos em produção'
              ],
              answer: 2,
              rate: 10,
              time: 300 // 5 minutes
            }
          ]
        },
        {
          questions: [
            {
              question: 'Qual a diferença entre uma lista e uma tupla em Python?',
              options: [
                'Listas são mutáveis e tuplas são imutáveis.',
                'Tuplas são mutáveis e listas são imutáveis.',
                'Listas e tuplas são mutáveis.',
                'Listas e tuplas são imutáveis.',
                'Não há diferença.'
              ],
              answer: 0,
              rate: 10,
              time: 300 // 5 minutes
            },
            {
              question: 'Qual das seguintes opções é uma estrutura de dados linear?',
              options: [
                'Árvore',
                'Grafo',
                'Lista ligada',
                'Hash table',
                'Heap'
              ],
              answer: 2,
              rate: 10,
              time: 300 // 5 minutes
            },
            {
              question: 'Em Java, qual palavra-chave é usada para herdar uma classe?',
              options: [
                'implements',
                'inherits',
                'extends',
                'super',
                'this'
              ],
              answer: 2,
              rate: 10,
              time: 300 // 5 minutes
            },
            {
              question: 'O que é uma variável estática em C++?',
              options: [
                'Uma variável que mantém seu valor entre chamadas de funções.',
                'Uma variável que só pode ser acessada dentro de um loop.',
                'Uma variável que é constante e não pode ser alterada.',
                'Uma variável que só pode ser acessada fora de uma classe.',
                'Uma variável que é inicializada apenas uma vez e nunca mais é usada.'
              ],
              answer: 0,
              rate: 10,
              time: 300 // 5 minutes
            },
            {
              question: 'Qual das seguintes opções é um exemplo de linguagem de programação funcional?',
              options: [
                'Java',
                'C',
                'Haskell',
                'Python',
                'HTML'
              ],
              answer: 2,
              rate: 10,
              time: 300 // 5 minutes
            }
          ]
        },
        {
          questions: [
            {
              question: 'Qual é a diferença entre "let" e "var" em JavaScript?',
              options: [
                '"let" tem escopo de função e "var" tem escopo de bloco.',
                '"let" tem escopo de bloco e "var" tem escopo de função.',
                'Não há diferença.',
                '"var" é usado para variáveis constantes e "let" para variáveis mutáveis.',
                '"let" é usado apenas em loops.'
              ],
              answer: 1,
              rate: 20,
              time: 400 // 6 minutes and 40 seconds
            },
            {
              question: 'O que faz o método "map()" em JavaScript?',
              options: [
                'Cria uma nova matriz com os resultados de chamar uma função para cada elemento da matriz.',
                'Modifica a matriz original iterando sobre seus elementos.',
                'Filtra os elementos da matriz de acordo com uma condição especificada.',
                'Reduz a matriz a um único valor.',
                'Ordena os elementos da matriz.'
              ],
              answer: 0,
              rate: 20,
              time: 400 // 6 minutes and 40 seconds
            },
            {
              question: 'Qual é o propósito do uso de "async" e "await" em JavaScript?',
              options: [
                'Permitir a execução síncrona de funções.',
                'Permitir a execução assíncrona de funções.',
                'Evitar exceções no código.',
                'Declarar variáveis.',
                'Criar loops infinitos.'
              ],
              answer: 1,
              rate: 20,
              time: 400 // 6 minutes and 40 seconds
            },
            {
              question: 'Em HTML, qual é a função da tag "<meta>"?',
              options: [
                'Definir metadados sobre o documento HTML.',
                'Adicionar scripts ao documento.',
                'Estilizar o conteúdo do documento.',
                'Criar links para outros documentos.',
                'Definir cabeçalhos e rodapés.'
              ],
              answer: 0,
              rate: 20,
              time: 400 // 6 minutes and 40 seconds
            },
            {
              question: 'Em CSS, o que significa a propriedade "z-index"?',
              options: [
                'Define o nível de empilhamento de um elemento.',
                'Define a opacidade de um elemento.',
                'Define a posição de um elemento na página.',
                'Define a cor de fundo de um elemento.',
                'Define o tamanho da fonte de um elemento.'
              ],
              answer: 0,
              rate: 20,
              time: 400 // 6 minutes and 40 seconds
            }
          ]
        },
        {
          questions: [
            {
              question: 'Qual é a principal vantagem do uso de bancos de dados NoSQL?',
              options: [
                'Escalabilidade horizontal.',
                'Consistência estrita.',
                'Suporte para consultas SQL.',
                'Normatização de dados.',
                'Nenhuma das alternativas.'
              ],
              answer: 0,
              rate: 30,
              time: 500 // 8 minutes and 20 seconds
            },
            {
              question: 'O que é um "closure" em JavaScript?',
              options: [
                'Uma função que se lembra do ambiente léxico no qual foi criada.',
                'Uma função que é chamada antes do carregamento do documento.',
                'Uma variável global.',
                'Um método que fecha a execução de um script.',
                'Uma estrutura de dados usada para armazenar variáveis.'
              ],
              answer: 0,
              rate: 30,
              time: 500 // 8 minutes and 20 seconds
            },
            {
              question: 'O que significa "REST" em desenvolvimento web?',
              options: [
                'Representational State Transfer',
                'Remote Server Transaction',
                'Relational State Table',
                'Remote State Transfer',
                'Representation of Server Transactions'
              ],
              answer: 0,
              rate: 30,
              time: 500 // 8 minutes and 20 seconds
            },
            {
              question: 'Qual das seguintes opções é um exemplo de uma arquitetura de software?',
              options: [
                'MVC',
                'CSS',
                'HTML',
                'JavaScript',
                'JSON'
              ],
              answer: 0,
              rate: 30,
              time: 500 // 8 minutes and 20 seconds
            },
            {
              question: 'O que é um "WebSocket"?',
              options: [
                'Um protocolo para comunicação bidirecional em tempo real entre um cliente e um servidor.',
                'Uma API para manipulação de documentos HTML e XML.',
                'Um padrão de autenticação para APIs.',
                'Uma técnica de caching para aumentar a velocidade da web.',
                'Um tipo de banco de dados NoSQL.'
              ],
              answer: 0,
              rate: 30,
              time: 500 // 8 minutes and 20 seconds
            }
          ]
        },
        {
          questions: [
            {
              question: 'O que é "Polimorfismo" em orientação a objetos?',
              options: [
                'A habilidade de um objeto de assumir várias formas.',
                'A capacidade de definir variáveis constantes.',
                'A técnica de esconder detalhes de implementação.',
                'A criação de uma nova classe baseada em uma existente.',
                'A organização de classes e objetos em uma hierarquia.'
              ],
              answer: 0,
              rate: 10,
              time: 300 // 5 minutes
            },
            {
              question: 'Qual é a diferença entre "abstract class" e "interface" em Java?',
              options: [
                'Uma classe abstrata pode ter métodos implementados; uma interface não.',
                'Uma interface pode ter métodos implementados; uma classe abstrata não.',
                'Não há diferença.',
                'Uma classe abstrata pode ser instanciada; uma interface não.',
                'Uma interface pode ser instanciada; uma classe abstrata não.'
              ],
              answer: 0,
              rate: 10,
              time: 300 // 5 minutes
            },
            {
              question: 'O que significa "ACID" em bancos de dados?',
              options: [
                'Atomicidade, Consistência, Isolamento, Durabilidade',
                'Agilidade, Consistência, Isolamento, Durabilidade',
                'Atomicidade, Confiabilidade, Integridade, Durabilidade',
                'Autenticidade, Consistência, Integridade, Durabilidade',
                'Atomicidade, Consistência, Integridade, Durabilidade'
              ],
              answer: 0,
              rate: 10,
              time: 300 // 5 minutes
            },
            {
              question: 'O que é um "Token JWT"?',
              options: [
                'Um padrão de token de acesso utilizado para autenticação e troca de informações.',
                'Um tipo de banco de dados NoSQL.',
                'Uma biblioteca JavaScript para manipulação de datas.',
                'Um método de criptografia de dados.',
                'Uma API para manipulação de documentos XML.'
              ],
              answer: 0,
              rate: 10,
              time: 300 // 5 minutes
            },
            {
              question: 'O que é "Refatoração" em desenvolvimento de software?',
              options: [
                'O processo de melhorar o código existente sem alterar seu comportamento externo.',
                'A técnica de adicionar novas funcionalidades ao software.',
                'A remoção de bugs e erros do código.',
                'A otimização do desempenho do software.',
                'A documentação do código existente.'
              ],
              answer: 0,
              rate: 10,
              time: 300 // 5 minutes
            }
          ]
        }
      ]
    };
    this.resetPhasesStatus();
    this.answers = this.selectedGame.phases.map(() => ({
      totalScore: 0,
      questions: [],
      totalTime: 0
    }));
  }

  getSelectedGame() {
    return this.selectedGame;
  }

  getPhasesStatus() {
    return this.phasesStatus;
  }

  completePhase(index: number): void {
    if (index >= 0 && index < this.phasesStatus.length) {
      const phase = this.answers[index];
      this.phasesStatus[index].completed = true;
      this.phasesStatus[index].current = false;
      this.phasesStatus[index].time = this.formatTime(phase.totalTime);
      this.phasesStatus[index].score = phase.totalScore;
      this.setNextPhaseActive(index + 1);
    }
  }

  setNextPhaseActive(index: number): void {
    if (index >= 0 && index < this.phasesStatus.length) {
      this.phasesStatus[index].current = true;
      this.phasesStatus[index].locked = false;
    }
  }

  allPhasesCompleted(): boolean {
    return this.phasesStatus.every((phase: any) => phase.completed);
  }

  private getCurrentTime(): string {
    const now = new Date();
    return now.toTimeString().split(' ')[0].substring(0, 5);
  }

  private formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  private resetPhasesStatus(): void {
    this.phasesStatus = this.selectedGame.phases.map((_: any, index: any) => ({
      completed: false,
      current: index === 0,
      locked: index !== 0,
      time: '',
      score: 0
    }));
  }

  setSelectedPhaseIndex(index: any): void {
    this.selectedPhaseIndex = index;
    this.selectedQuestionIndex = 0; // Reset the question index when selecting a new phase
  }

  getSelectedPhaseIndex() {
    return this.selectedPhaseIndex;
  }

  getSelectedPhase() {
    return this.selectedPhaseIndex !== null ? this.selectedGame.phases[this.selectedPhaseIndex] : null;
  }

  nextQuestion(): boolean {
    if (this.selectedPhaseIndex !== null && this.selectedQuestionIndex < this.selectedGame.phases[this.selectedPhaseIndex].questions.length - 1) {
      this.selectedQuestionIndex++;
      return true;
    }
    return false;
  }

  getSelectedQuestion() {
    if (this.selectedPhaseIndex !== null) {
      return this.selectedGame.phases[this.selectedPhaseIndex].questions[this.selectedQuestionIndex];
    }
    return null;
  }

  getSelectedQuestionIndex(): number {
    return this.selectedQuestionIndex;
  }

  setAnswer(isCorrect: boolean, answerIndex: number, scoreMultiplier: boolean) {
    if (this.selectedPhaseIndex !== null) {
      const phase = this.answers[this.selectedPhaseIndex];
      const question = this.selectedGame.phases[this.selectedPhaseIndex].questions[this.selectedQuestionIndex];
      const score = isCorrect ? scoreMultiplier ? question.rate * 2 : question.rate : 0;
      phase.totalScore += score;
      phase.questions.push({
        questionIndex: this.selectedQuestionIndex,
        isCorrect,
        answerIndex,
        score,
        scoreMultiplier
      });
    }
  }

  addTimeToPhase(time: number) {
    if (this.selectedPhaseIndex !== null) {
      this.answers[this.selectedPhaseIndex].totalTime += time;
    }
  }

  getAnswers() {
    return this.answers;
  }

  setGame(game: any) {
    this.selectedGame = game;
  }

  openTrackDialog(isEdit: boolean, track: any = null): void {
    const dialogRef = this.dialog.open(TrackDialogComponent, {
      data: { isEdit, track }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        if (isEdit) {
          // this.trackService.updateTrack(result).subscribe(response => {
          //   console.log('Trilha atualizada com sucesso:', response);
          // }, error => {
          //   console.error('Erro ao atualizar trilha:', error);
          // });
        } else {
                     console.log('Trilha criada com sucesso:', result);

        //   this.trackService.createTrack(result).subscribe(response => {
        //     console.log('Trilha criada com sucesso:', response);
        //   }, error => {
        //     console.error('Erro ao criar trilha:', error);
        //   });
        // }
        }
      }
    });
  }

}
