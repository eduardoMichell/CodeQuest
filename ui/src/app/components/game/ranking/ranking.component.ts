import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.css']
})
export class RankingComponent {
  constructor(
    public dialogRef: MatDialogRef<RankingComponent>,
  ){}

  ranking = [
    { posicao: 1, nome: 'Jogador 1', pontuacaoTotal: 1200, taxaVitoria: '75%' },
    { posicao: 2, nome: 'Jogador 2', pontuacaoTotal: 1100, taxaVitoria: '70%' },
    { posicao: 3, nome: 'Jogador 3', pontuacaoTotal: 1050, taxaVitoria: '65%' },
    { posicao: 4, nome: 'Jogador 1', pontuacaoTotal: 1200, taxaVitoria: '75%' },
    { posicao: 5, nome: 'Jogador 2', pontuacaoTotal: 1100, taxaVitoria: '70%' },
    { posicao: 6, nome: 'Jogador 3', pontuacaoTotal: 1050, taxaVitoria: '65%' },
    { posicao: 7, nome: 'Jogador 1', pontuacaoTotal: 1200, taxaVitoria: '75%' },
    { posicao: 8, nome: 'Jogador 2', pontuacaoTotal: 1100, taxaVitoria: '70%' },
    { posicao: 9, nome: 'Jogador 3', pontuacaoTotal: 1050, taxaVitoria: '65%' },
    { posicao: 10, nome: 'Jogador 1', pontuacaoTotal: 1200, taxaVitoria: '75%' },
    { posicao: 11, nome: 'Jogador 2', pontuacaoTotal: 1100, taxaVitoria: '70%' },
    { posicao: 12, nome: 'Jogador 3', pontuacaoTotal: 1050, taxaVitoria: '65%' },    
  ];
  userPos = 4;

  close() {
    this.dialogRef.close();
  }
}
