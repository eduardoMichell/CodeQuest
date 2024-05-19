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
  ) {}

  ngOnInit(): void {}

  onClose(): void {
    this.dialogRef.close();
  }

  generatePDF(track: any): void {
    const doc = new jsPDF();
    doc.text(`Relatório da Trilha`, 10, 10);
    doc.text(`Tema: ${track.theme}`, 10, 20);
    doc.text(`Dificuldade: ${track.difficulty}`, 10, 30);
    doc.save(`${track.theme}-relatorio.pdf`);
  }

  editTrack(track: any): void {
    this.onClose();
    this.gameService.openTrackDialog(true, track);
  }
}
