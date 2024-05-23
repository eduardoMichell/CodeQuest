import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AnswerService } from 'src/app/services/answer-service/answer.service';
import { UtilsService } from 'src/app/services/utils-service/utils.service';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.css']
})
export class RankingComponent {
  ranking: any = [];
  userPos: number = 0;
  constructor(
    public dialogRef: MatDialogRef<RankingComponent>,
    private answerService: AnswerService,
    private utils: UtilsService
  ){}

  ngOnInit(): void {
    this.loadRanking();
  }

  loadRanking(): void {
    this.answerService.getRanking().subscribe((data: any) => {
        this.ranking = data.result.ranking;
        this.userPos = data.result.userPos;
      },(error: any) => {
        console.error('Error loading ranking', error);
        this.utils.showMessage('Erro ao carregar o ranking. Por favor, tente novamente mais tarde.', true);
      }
    );
  }
 

  close() {
    this.dialogRef.close();
  }
}
