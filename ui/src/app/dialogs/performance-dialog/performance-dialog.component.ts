import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { GameService } from 'src/app/services/game-service/game.service';

@Component({
  selector: 'app-performance-dialog',
  templateUrl: './performance-dialog.component.html',
  styleUrls: ['./performance-dialog.component.css']
})
export class PerformanceDialogComponent {
  motivationalQuote: string = "";

  constructor(
    public dialogRef: MatDialogRef<PerformanceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private gameService: GameService
  ) {}

  ngOnInit(): void {
    this.gameService.getQuotes().subscribe(data => {
      const randomIndex = Math.floor(Math.random() * data.length);
      this.motivationalQuote = data[randomIndex];
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }  
}
