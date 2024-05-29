import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import jsPDF from 'jspdf';
import { GameService } from 'src/app/services/game-service/game.service';

@Component({
  selector: 'app-view-tracks',
  templateUrl: './view-tracks.component.html',
  styleUrls: ['./view-tracks.component.css']
})
export class ViewTracksComponent {
  constructor(
    public dialogRef: MatDialogRef<ViewTracksComponent>,
    private gameService: GameService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
  }

  onClose(): void {
    this.dialogRef.close();
  }

  generatePDF(track: any): void {
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height;
    let yPos = 10;

    doc.setFontSize(18);
    doc.text('Relatório da Trilha', 10, yPos);
    yPos += 10;

    doc.setFontSize(12);
    doc.text(`Tema: ${track.theme}`, 10, yPos);
    yPos += 10;
    doc.text(`Dificuldade: ${track.difficulty}`, 10, yPos);
    yPos += 10;
    doc.text(`Total de Respostas Corretas: ${track.totalCorrect}`, 10, yPos);
    yPos += 10;
    doc.text(`Total de Respostas Erradas: ${track.totalIncorrect}`, 10, yPos);
    yPos += 10;

    const addPageIfNeeded = (yPos: number, increment: number) => {
        if (yPos + increment > pageHeight - 10) {
            doc.addPage();
            return 10; // Reset yPos to start of the new page
        }
        return yPos + increment;
    };

    if (track.hardestQuestion) {
        yPos = addPageIfNeeded(yPos, 20);
        doc.text(`Pergunta Mais Difícil:`, 10, yPos);
        yPos = addPageIfNeeded(yPos, 10);
        const wrappedText = doc.splitTextToSize(track.hardestQuestion.question, 180);
        doc.text(wrappedText, 10, yPos);
        yPos = addPageIfNeeded(yPos, wrappedText.length * 10);
        doc.text(`Opções: ${track.hardestQuestion.options.join(', ')}`, 10, yPos);
        yPos = addPageIfNeeded(yPos, 10);
    }

    if (track.easiestQuestion) {
        yPos = addPageIfNeeded(yPos, 20);
        doc.text(`Pergunta Mais Fácil:`, 10, yPos);
        yPos = addPageIfNeeded(yPos, 10);
        const wrappedText = doc.splitTextToSize(track.easiestQuestion.question, 180);
        doc.text(wrappedText, 10, yPos);
        yPos = addPageIfNeeded(yPos, wrappedText.length * 10);
        doc.text(`Opções: ${track.easiestQuestion.options.join(', ')}`, 10, yPos);
        yPos = addPageIfNeeded(yPos, 10);
    }

    yPos = addPageIfNeeded(yPos, 20);
    const playerNames = track.players.join(', ');
    doc.text(`Jogadores que jogaram: ${playerNames}`, 10, yPos);

    doc.save(`${track.theme}-relatorio.pdf`);
}

  
  editTrack(track: any): void {
    this.gameService.getGameById(track.id).subscribe((data: any) => {
      this.onClose();
      this.gameService.openTrackDialog(true, data.result, track.id);
    }, (error: any) => {
      console.error('Error fetching selected game', error);
    }
    );
  }
}
