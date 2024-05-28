import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TrackDialogComponent } from 'src/app/dialogs/track-dialog/track-dialog.component';
import { environment } from "../../../environments/environment";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserService } from '../user-service/user.service';
import { Observable } from 'rxjs/internal/Observable';
import { UtilsService } from '../utils-service/utils.service';


const API_URL = environment.API_URL + "/game/";

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private selectedGame: any = null;
  private phasesStatus: any = [];
  private selectedPhaseIndex: number | null = null;
  private selectedQuestionIndex: number = 0;
  private answers: any = [];

  constructor(
    private dialog: MatDialog,
    private userService: UserService,
    private http: HttpClient,
    private utils: UtilsService
  ) {
  }

  setSelectedGame(game: any) {
    this.selectedGame = game;
    this.resetPhasesStatus();
    this.answers = this.selectedGame.phases.map(() => ({
      totalScore: 0,
      questions: [],
      totalTime: 0
    }));
  }

  getSelectedGame() {
    return this.selectedGame;
  }

  getPhasesStatus() {
    return this.phasesStatus;
  }

  completePhase(index: number): void {
    if (index >= 0 && index < this.phasesStatus.length) {
      const phase = this.answers[index];
      this.phasesStatus[index].completed = true;
      this.phasesStatus[index].current = false;
      this.phasesStatus[index].time = this.formatTime(phase.totalTime);
      this.phasesStatus[index].score = phase.totalScore;
      this.setNextPhaseActive(index + 1);
    }
  }

  setNextPhaseActive(index: number): void {
    if (index >= 0 && index < this.phasesStatus.length) {
      this.phasesStatus[index].current = true;
      this.phasesStatus[index].locked = false;
    }
  }

  allPhasesCompleted(): boolean {
    return this.phasesStatus.every((phase: any) => phase.completed);
  }

  private getCurrentTime(): string {
    const now = new Date();
    return now.toTimeString().split(' ')[0].substring(0, 5);
  }

  private formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  private resetPhasesStatus(): void {
    this.phasesStatus = this.selectedGame.phases.map((_: any, index: any) => ({
      completed: false,
      current: index === 0,
      locked: index !== 0,
      time: '',
      score: 0
    }));
  }

  setSelectedPhaseIndex(index: any): void {
    this.selectedPhaseIndex = index;
    this.selectedQuestionIndex = 0;
  }

  getSelectedPhaseIndex() {
    return this.selectedPhaseIndex;
  }

  getSelectedPhase() {
    return this.selectedPhaseIndex !== null ? this.selectedGame.phases[this.selectedPhaseIndex] : null;
  }

  nextQuestion(): boolean {
    if (this.selectedPhaseIndex !== null && this.selectedQuestionIndex < this.selectedGame.phases[this.selectedPhaseIndex].questions.length - 1) {
      this.selectedQuestionIndex++;
      return true;
    }
    return false;
  }

  getSelectedQuestion() {
    if (this.selectedPhaseIndex !== null) {
      return this.selectedGame.phases[this.selectedPhaseIndex].questions[this.selectedQuestionIndex];
    }
    return null;
  }

  getSelectedQuestionIndex(): number {
    return this.selectedQuestionIndex;
  }

  setAnswer(isCorrect: boolean, answerIndex: number, scoreMultiplier: boolean) {
    if (this.selectedPhaseIndex !== null) {
      const phase = this.answers[this.selectedPhaseIndex];
      const question = this.selectedGame.phases[this.selectedPhaseIndex].questions[this.selectedQuestionIndex];
      const score = isCorrect ? scoreMultiplier ? question.rate * 2 : question.rate : 0;
      phase.totalScore += score;
      phase.questions.push({
        questionIndex: this.selectedQuestionIndex,
        isCorrect,
        answerIndex,
        score,
        scoreMultiplier
      });
    }
  }

  addTimeToPhase(time: number) {
    if (this.selectedPhaseIndex !== null) {
      this.answers[this.selectedPhaseIndex].totalTime += time;
    }
  }

  getAnswers() {
    return this.answers;
  }

  setGame(game: any) {
    this.selectedGame = game;
  }

  openTrackDialog(isEdit: boolean, track: any = null, trackId: any = null): void {
    const dialogRef = this.dialog.open(TrackDialogComponent, {
      data: { isEdit, track }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        if (isEdit) {
          this.updateTrack(trackId, result).subscribe(response => {
            this.utils.showMessage('Trilha atualizada com sucesso');
            window.location.reload();
          }, error => {
            this.utils.showMessage('Falha ao editar a trilha', true);
          });
        } else {
          this.createTrack(result).subscribe(response => {
            this.utils.showMessage('Trilha criada com sucesso');
            window.location.reload();
          }, error => {
            this.utils.showMessage('Falha ao criar a trilha', true);
          });
        }
      }
    });
  }

  createTrack(track: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `${this.userService.getToken()}`,
    });
    return this.http.post<any>(`${API_URL}create`, track, { headers });
  }


  updateTrack(trackId: string, track: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `${this.userService.getToken()}`,
    });
    return this.http.put<any>(`${API_URL}edit/${trackId}`, track, { headers });
  }

  getGames(): Observable<any[]> {
    const headers = new HttpHeaders({
      'Authorization': `${this.userService.getToken()}`,
    });
    return this.http.get<any[]>(`${API_URL}tracks`, { headers });
  }

  getGameById(gameId: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `${this.userService.getToken()}`,
    });
    return this.http.get<any>(`${API_URL}to-play/${gameId}`, { headers });
  }

  getTracksInfo(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `${this.userService.getToken()}`,
    });
    return this.http.get<any>(`${API_URL}view-tracks`, { headers });
  }

  deleteTrack(trackId: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `${this.userService.getToken()}`,
    });
    return this.http.delete<any>(`${API_URL}delete/${trackId}`, { headers });
  }
}
