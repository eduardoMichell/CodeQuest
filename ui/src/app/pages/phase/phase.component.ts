import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ResultDialogComponent } from 'src/app/dialogs/result-dialog/result-dialog.component';
import { GameService } from 'src/app/services/game-service/game.service';
import { HeaderService } from 'src/app/services/header-service/header.service';

@Component({
  selector: 'app-phase',
  templateUrl: './phase.component.html',
  styleUrls: ['./phase.component.css']
})
export class PhaseComponent {
  question: any;
  timer: any;
  interval: any;
  scoreMultiplier: boolean = true;
  startTime: any;

  constructor(
    private gameService: GameService,
    private router: Router,
    private headerService: HeaderService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.question = this.gameService.getSelectedQuestion();
    if (this.question === null) {
      this.router.navigate(['/game']);
    } else {
      this.timer = this.question.time;
      this.startTimer();
    }
  }

  ngOnDestroy(): void {
    this.clearTimer();
  }

  startTimer(): void {
    this.startTime = Date.now();
    this.timer--;
    if (this.timer <= this.question.time / 2) {
      this.scoreMultiplier = false;
    }
    if (this.timer <= 0) {
      this.clearTimer();
      this.handleTimerEnd();
      return;
    }
    this.interval = setInterval(() => {
      this.timer--;
      if (this.timer <= this.question.time / 2) {
        this.scoreMultiplier = false;
      }
      if (this.timer <= 0) {
        this.clearTimer();
        this.handleTimerEnd();
      }
    }, 1000);
  }

  clearTimer(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  selectOption(index: number): void {
    const isCorrect = index === this.question.answer;
    this.gameService.setAnswer(isCorrect, index, this.scoreMultiplier);
    this.recordTimeSpent();
    this.clearTimer();
    const message = isCorrect ? 'Você Acertou!' : 'Você Errou!';
    const points = isCorrect ? this.question.rate : 0;

    this.openResultDialog(message, points, this.scoreMultiplier, isCorrect, false);

  }

  handleTimerEnd(): void {
    this.gameService.setAnswer(false, -1, false);
    this.recordTimeSpent();
    this.openResultDialog('O tempo acabou!', 0, false, false, true);
  }

  recordTimeSpent(): void {
    const timeSpent = Math.ceil((Date.now() - this.startTime) / 1000);
    const minimumTimeSpent = Math.max(timeSpent, 1);
    this.gameService.addTimeToPhase(minimumTimeSpent);
  }

  getOptionLetter(index: number): string {
    return String.fromCharCode(65 + index);
  }

  getQuestionNumber(): number {
    return this.gameService.getSelectedQuestionIndex() + 1;
  }

  openResultDialog(message: string, points: number, scoreMultiplier: boolean, isCorrect: boolean, timeEnd: boolean = false): void {
    const dialogRef = this.dialog.open(ResultDialogComponent, {
      data: { message: message, points: points, scoreMultiplier: scoreMultiplier, isCorrect, timeEnd }
    });

    dialogRef.afterClosed().subscribe(() => {
      if (this.gameService.nextQuestion()) {
        this.ngOnInit();
        this.scoreMultiplier = true;
      } else {
        console.log('Fase concluída!');
        this.gameService.completePhase(this.gameService.getSelectedPhaseIndex() || 0);
        this.router.navigate(['/game']);
      }
    });
  }
}
