import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderService } from 'src/app/services/header-service/header.service';
import { GameService } from 'src/app/services/game-service/game.service';
import { FinishDialogComponent } from 'src/app/dialogs/finish-dialog/finish-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AnswerService } from 'src/app/services/answer-service/answer.service';
import { UtilsService } from 'src/app/services/utils-service/utils.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  game: any;
  currentScore = 0;
  phasesStatus: any = [];

  constructor(
    private router: Router,
    private headerService: HeaderService,
    private gameService: GameService,
    private dialog: MatDialog,
    private answerService: AnswerService,
    private utils: UtilsService
  ) { }

  ngOnInit() {
    this.game = this.gameService.getSelectedGame();
    this.gameService.setSelectedPhaseIndex(null);
    if (this.game === null) {
      this.router.navigate(['/home']);
    } else {
      this.headerService.headerData = {
        title: `${this.game.theme} - ${this.game.difficulty}`,
        icon: '',
        routeUrl: ''
      };
      this.phasesStatus = this.gameService.getPhasesStatus();
      this.currentScore = this.calculateTotalScore();
    }
  }

  calculateTotalScore(): number {
    return this.gameService.getAnswers().reduce((total: number, phase: any) => total + phase.totalScore, 0);
  }

  selectPhase(index: number): void {
    if (!this.phasesStatus[index].locked && !this.phasesStatus[index].completed) {
      console.log(`Fase ${index} selecionada`);
      this.gameService.setSelectedPhaseIndex(index);
      this.router.navigate(['/game/phase']);
    }
  }

  finish(): void {
    if (this.gameService.allPhasesCompleted()) {
      this.openFinishDialog(this.currentScore);
    }
  }

  openFinishDialog(score: number): void {
    const dialogRef = this.dialog.open(FinishDialogComponent, {
      data: { score: score }
    });

    dialogRef.afterClosed().subscribe(() => {
      const answer = {
        gameId: this.game._id,
        score: this.currentScore,
        questions: this.gameService.getAnswers() 
      };
      console.log(answer)
      this.answerService.saveAnswer(answer).subscribe((response: any) => {
        this.utils.showMessage("Suas respostas foram salvas com sucesso!");
        this.router.navigate(['/home']);
        },(error: any) => {
          this.utils.showMessage("Erro ao salvar suas respostas. Por favor, tente novamente.", true);
          console.error('Erro ao salvar as respostas', error);
        }
      );
    });
  }

  allPhasesCompleted(): boolean {
    return this.gameService.allPhasesCompleted();
  }

  getScore(index: number): number {
    return this.phasesStatus[index].score || 0;
  }

  getFormattedTime(index: number): string {
    return this.phasesStatus[index].time || '00:00';
  }
}
