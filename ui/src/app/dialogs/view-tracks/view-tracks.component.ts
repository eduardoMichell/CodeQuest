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

    doc.setFontSize(18);
    doc.text('Relatório da Trilha', 10, 10);

    doc.setFontSize(12);
    doc.text(`Tema: ${track.theme}`, 10, 20);
    doc.text(`Dificuldade: ${track.difficulty}`, 10, 30);
    doc.text(`Total de Respostas Corretas: ${track.totalCorrect}`, 10, 40);
    doc.text(`Total de Respostas Erradas: ${track.totalIncorrect}`, 10, 50);

    if (track.hardestQuestion) {
      doc.text(`Pergunta Mais Difícil:`, 10, 60);
      doc.text(doc.splitTextToSize(track.hardestQuestion.question, 180), 10, 70);
      doc.text(`Opções: ${track.hardestQuestion.options.join(', ')}`, 10, 90);
    }
    if (track.easiestQuestion) {
      doc.text(`Pergunta Mais Fácil:`, 10, 100);
      doc.text(doc.splitTextToSize(track.easiestQuestion.question, 180), 10, 110);
      doc.text(`Opções: ${track.easiestQuestion.options.join(', ')}`, 10, 130);
    }

    const playerNames = track.players.join(', ');
    doc.text(`Jogadores que jogaram: ${playerNames}`, 10, 150);

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
