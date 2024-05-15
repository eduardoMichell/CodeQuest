import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-performance-dialog',
  templateUrl: './performance-dialog.component.html',
  styleUrls: ['./performance-dialog.component.css']
})
export class PerformanceDialogComponent {
  motivationalQuote: string = "";

  constructor(
    public dialogRef: MatDialogRef<PerformanceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.motivationalQuote = this.getMotivationalQuote();
  }

  onClose(): void {
    this.dialogRef.close();
  }

  getMotivationalQuote(): string {
    const quotes = [
      "Nunca desista!",
      "O sucesso é a soma de pequenos esforços repetidos dia após dia.",
      "Acredite em você mesmo!",
      "Cada dificuldade é uma oportunidade para crescer.",
      "Persistência é o caminho do êxito."
    ];
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
  }
}
