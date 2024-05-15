import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GameService } from 'src/app/services/game-service/game.service';

@Component({
  selector: 'app-select-game',
  templateUrl: './select-game.component.html',
  styleUrls: ['./select-game.component.css']
})
export class SelectGameComponent {
  constructor(
    public dialogRef: MatDialogRef<SelectGameComponent>,
    private router: Router,
    private gameService: GameService
  ) {
  }

  games = [
    { tema: 'Tema 1', dificuldade: 'Fácil', jogado: 'Sim' },
    { tema: 'Tema 2', dificuldade: 'Médio', jogado: 'Não' },
    { tema: 'Tema 3', dificuldade: 'Difícil', jogado: 'Sim' },
    { tema: 'Tema 1', dificuldade: 'Fácil', jogado: 'Sim' },
    { tema: 'Tema 2', dificuldade: 'Médio', jogado: 'Não' },
    { tema: 'Tema 3', dificuldade: 'Difícil', jogado: 'Sim' },
    { tema: 'Tema 1', dificuldade: 'Fácil', jogado: 'Sim' },
    { tema: 'Tema 2', dificuldade: 'Médio', jogado: 'Não' },
    { tema: 'Tema 3', dificuldade: 'Difícil', jogado: 'Sim' },
    { tema: 'Tema 1', dificuldade: 'Fácil', jogado: 'Sim' },
    { tema: 'Tema 2', dificuldade: 'Médio', jogado: 'Não' },
    { tema: 'Tema 3', dificuldade: 'Difícil', jogado: 'Sim' },
    { tema: 'Tema 1', dificuldade: 'Fácil', jogado: 'Sim' },
    { tema: 'Tema 2', dificuldade: 'Médio', jogado: 'Não' },
    { tema: 'Tema 3', dificuldade: 'Difícil', jogado: 'Sim' },
    { tema: 'Tema 1', dificuldade: 'Fácil', jogado: 'Sim' },
    { tema: 'Tema 2', dificuldade: 'Médio', jogado: 'Não' },
    { tema: 'Tema 3', dificuldade: 'Difícil', jogado: 'Sim' },
    { tema: 'Tema 1', dificuldade: 'Fácil', jogado: 'Sim' },
    { tema: 'Tema 2', dificuldade: 'Médio', jogado: 'Não' },
    { tema: 'Tema 3', dificuldade: 'Difícil', jogado: 'Sim' },

    // Add more games as needed
  ];
  selectedGame = null;

  selectRow(game: any) {
    this.selectedGame = game;
  }

  cancel() {
    this.dialogRef.close();
  }

  start() {
    if (this.selectedGame) {
      this.gameService.setSelectedGame(this.selectedGame);
      this.router.navigate(['/game'], { state: { selectedGame: this.selectedGame } });
      this.dialogRef.close();
    }
  }
}
