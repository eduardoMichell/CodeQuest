import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-answered-tracks-dialog',
  templateUrl: './answered-tracks-dialog.component.html',
  styleUrls: ['./answered-tracks-dialog.component.css']
})
export class AnsweredTracksDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<AnsweredTracksDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {}

  onClose(): void {
    this.dialogRef.close();
  }

  generatePDF(track: any): void {
    const doc = new jsPDF();
    doc.text(`Estatísticas da Trilha`, 10, 10);
    doc.text(`Tema: ${track.theme}`, 10, 20);
    doc.text(`Dificuldade: ${track.difficulty}`, 10, 30);
    doc.text(`Jogos: ${track.games}`, 10, 40);
    doc.text(`Total de Pontos: ${track.totalPoints}`, 10, 50);
    doc.save(`${track.theme}-estatisticas.pdf`);
  }
}
