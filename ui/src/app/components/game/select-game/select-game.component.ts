import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GameService } from 'src/app/services/game-service/game.service';

@Component({
  selector: 'app-select-game',
  templateUrl: './select-game.component.html',
  styleUrls: ['./select-game.component.css']
})
export class SelectGameComponent implements OnInit {
  games: any[] = [];
  selectedGame: any = null;
  
  constructor(
    public dialogRef: MatDialogRef<SelectGameComponent>,
    private router: Router,
    private gameService: GameService
  ) {
  }
  ngOnInit(): void {
    this.gameService.getGames().subscribe(
      (data: any) => {
        console.log("getGames() ::", data.result.games)
        this.games = data.result.games;
      },
      (error) => {
        console.error('Error loading games', error);
      }
    );
  }

  selectRow(game: any) {
    this.selectedGame = game;
  }

  cancel() {
    this.dialogRef.close();
  }

  start() {
    if (this.selectedGame) {
      this.gameService.getGameById(this.selectedGame._id).subscribe((data: any) => {
        const selectedGame = data.result;
        this.gameService.setSelectedGame(selectedGame);
        this.router.navigate(['/game'], { state: { selectedGame: selectedGame } });
        this.dialogRef.close();
      }, (error: any) => {
        console.error('Error fetching selected game', error);
      }
      );
    }
  }
}
