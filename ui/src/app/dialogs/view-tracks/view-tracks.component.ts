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
    console.log("generatePDF() :: ", track);
    
    const headerColor: [number, number, number] = [255, 133, 51];  

    doc.setFontSize(18);
    doc.setTextColor(...headerColor);
    doc.text('Relatório da Trilha', 10, yPos);
    yPos += 10;

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
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
            return 10;
        }
        return yPos + increment;
    };

    const addWrappedText = (text: string, x: number, y: number, maxWidth: number) => {
        const lines = doc.splitTextToSize(text, maxWidth);
        lines.forEach((line: any) => {
            doc.text(line, x, y);
            y = addPageIfNeeded(y, 10);
        });
        return y;
    };

    if (track.hardestQuestion) {
        yPos = addPageIfNeeded(yPos, 20);
        doc.setTextColor(...headerColor);
        doc.text(`Pergunta Mais Difícil:`, 10, yPos);
        yPos = addPageIfNeeded(yPos, 10);
        doc.setTextColor(0, 0, 0);
        yPos = addWrappedText(track.hardestQuestion.question, 10, yPos, 180);
        yPos = addPageIfNeeded(yPos, 10);
        yPos = addWrappedText(`Opções: ${track.hardestQuestion.options.join(', ')}`, 10, yPos, 180);
        yPos = addPageIfNeeded(yPos, 10);
    }

    if (track.easiestQuestion) {
        yPos = addPageIfNeeded(yPos, 20);
        doc.setTextColor(...headerColor);
        doc.text(`Pergunta Mais Fácil:`, 10, yPos);
        yPos = addPageIfNeeded(yPos, 10);
        doc.setTextColor(0, 0, 0); 
        yPos = addWrappedText(track.easiestQuestion.question, 10, yPos, 180);
        yPos = addPageIfNeeded(yPos, 10);
        yPos = addWrappedText(`Opções: ${track.easiestQuestion.options.join(', ')}`, 10, yPos, 180);
        yPos = addPageIfNeeded(yPos, 10);
    }

    yPos = addPageIfNeeded(yPos, 20);
    doc.setTextColor(...headerColor);
    const playerNames = track.players.join(', ');
    yPos = addWrappedText(`Jogadores que jogaram: ${playerNames}`, 10, yPos, 180);

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
