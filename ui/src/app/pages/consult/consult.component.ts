import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AnsweredTracksDialogComponent } from 'src/app/dialogs/answered-tracks-dialog/answered-tracks-dialog.component';
import { PerformanceDialogComponent } from 'src/app/dialogs/performance-dialog/performance-dialog.component';
import { GameService } from 'src/app/services/game-service/game.service';
import { HeaderService } from 'src/app/services/header-service/header.service';
import { UserService } from 'src/app/services/user-service/user.service';

@Component({
  selector: 'app-consult',
  templateUrl: './consult.component.html',
  styleUrls: ['./consult.component.css']
})
export class ConsultComponent implements OnInit{

  constructor(
    private headerService: HeaderService,
    public dialog: MatDialog,
    private userService: UserService,
    private gameService: GameService

  ) {
  }

  ngOnInit(): void {
    this.headerService.headerData = {
      title: 'Consultar',
      icon: '',
      routeUrl: ''
    };
  }

  isAdmin() {
    return this.userService.isAdmin();
  }
  
  isLogged() {
    return this.userService.isLogged();
  }

  openPerformanceDialog(): void {
    const dialogRef = this.dialog.open(PerformanceDialogComponent, {
      data: {
        totalTracksPlayed: 10,
        totalQuestionsAnswered: 100,
        totalCorrectAnswers: 80,
        totalIncorrectAnswers: 20,
        totalPoints: 1500
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  openAnsweredTracksDialog(): void {
    const dialogRef = this.dialog.open(AnsweredTracksDialogComponent, {
      data: {
        tracks: [
          { theme: 'Matemática', difficulty: 'Fácil', games: 5, totalPoints: 100 },
          { theme: 'História', difficulty: 'Médio', games: 3, totalPoints: 80 },
          { theme: 'Ciências', difficulty: 'Difícil', games: 4, totalPoints: 90 },
          { theme: 'Matemática', difficulty: 'Fácil', games: 5, totalPoints: 100 },
          { theme: 'História', difficulty: 'Médio', games: 3, totalPoints: 80 },
          { theme: 'Ciências', difficulty: 'Difícil', games: 4, totalPoints: 90 },
          { theme: 'Matemática', difficulty: 'Fácil', games: 5, totalPoints: 100 },
          { theme: 'História', difficulty: 'Médio', games: 3, totalPoints: 80 },
          { theme: 'Ciências', difficulty: 'Difícil', games: 4, totalPoints: 90 },
          { theme: 'Matemática', difficulty: 'Fácil', games: 5, totalPoints: 100 },
          { theme: 'História', difficulty: 'Médio', games: 3, totalPoints: 80 },
          { theme: 'Ciências', difficulty: 'Difícil', games: 4, totalPoints: 90 },
          { theme: 'Matemática', difficulty: 'Fácil', games: 5, totalPoints: 100 },
          { theme: 'História', difficulty: 'Médio', games: 3, totalPoints: 80 },
          { theme: 'Ciências', difficulty: 'Difícil', games: 4, totalPoints: 90 },
          { theme: 'Matemática', difficulty: 'Fácil', games: 5, totalPoints: 100 },
          { theme: 'História', difficulty: 'Médio', games: 3, totalPoints: 80 },
          { theme: 'Ciências', difficulty: 'Difícil', games: 4, totalPoints: 90 }
        ]
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}
