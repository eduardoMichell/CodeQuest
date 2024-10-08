import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AnswerService } from 'src/app/services/answer-service/answer.service';
import { UserService } from 'src/app/services/user-service/user.service';
import { UtilsService } from 'src/app/services/utils-service/utils.service';

@Component({
  selector: 'app-answered-tracks-dialog',
  templateUrl: './answered-tracks-dialog.component.html',
  styleUrls: ['./answered-tracks-dialog.component.css']
})
export class AnsweredTracksDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<AnsweredTracksDialogComponent>,
    private utils: UtilsService,
    private answerService: AnswerService,
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
  }

  onClose(): void {
    this.dialogRef.close();
  }

  generatePDF(theme: any): void {
    this.answerService.getUserDetailedStats().subscribe((data: any) => {
      const detailedStats = data.result.find((stat: any) => stat.theme === theme.theme && stat.difficulty === theme.difficulty);
  
      const doc = new jsPDF();
      
      doc.setFontSize(18);
      doc.text('Estatísticas da Trilha', 10, 10);
  
      doc.setFontSize(12);
      doc.text(`Aluno: ${this.userService.getUser().name}`, 10, 20);
      doc.text(`Tema: ${theme.theme}`, 10, 30);
      doc.text(`Dificuldade: ${theme.difficulty}`, 10, 40);
      doc.text(`Jogado: ${theme.played ? 'Sim' : 'Não'}`, 10, 50);
      doc.text(`Total de Pontos: ${theme.totalPoints}`, 10, 60);
  
      if (detailedStats && theme.played) {
        const statistics = [
          ['Total de Perguntas Respondidas', detailedStats.totalQuestionsAnswered],
          ['Total de Respostas Corretas', detailedStats.totalCorrectAnswers],
          ['Total de Respostas Incorretas', detailedStats.totalIncorrectAnswers]
        ];
  
        autoTable(doc, {
          startY: 70,
          head: [['Estatística', 'Valor']],
          body: statistics,
          theme: 'striped',
          headStyles: { fillColor: [255, 133, 51] },
          styles: { fontSize: 10 }
        });
      }
  
      doc.save(`${theme.theme}-estatisticas.pdf`);
    }, (error: any) => {
        console.error('Erro ao carregar as estatísticas detalhadas', error);
        this.utils.showMessage('Erro ao carregar as estatísticas detalhadas. Por favor, tente novamente mais tarde.', true);
      }
    );
  }
  
}
