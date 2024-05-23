import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AnsweredTracksDialogComponent } from 'src/app/dialogs/answered-tracks-dialog/answered-tracks-dialog.component';
import { PerformanceDialogComponent } from 'src/app/dialogs/performance-dialog/performance-dialog.component';
import { AnswerService } from 'src/app/services/answer-service/answer.service';
import { GameService } from 'src/app/services/game-service/game.service';
import { HeaderService } from 'src/app/services/header-service/header.service';
import { UserService } from 'src/app/services/user-service/user.service';
import { UtilsService } from 'src/app/services/utils-service/utils.service';

@Component({
  selector: 'app-consult',
  templateUrl: './consult.component.html',
  styleUrls: ['./consult.component.css']
})
export class ConsultComponent implements OnInit {
  stats: any = null;
  tracks: any = null;
  constructor(
    private headerService: HeaderService,
    public dialog: MatDialog,
    private userService: UserService,
    private answerService: AnswerService,
    private utils: UtilsService
  ) {
  }

  ngOnInit(): void {
    this.headerService.headerData = {
      title: 'Consultar',
      icon: '',
      routeUrl: ''
    };
    this.loadUserStats();
    this.loadTracks();

  }

  loadUserStats(): void {
    this.answerService.getUserStats().subscribe((data: any) => {
      this.stats = data.result;
    }, (error: any) => {
      this.utils.showMessage('Erro ao carregar as estatísticas do usuário. Por favor, tente novamente mais tarde.', true);
    }
    );
  }

  loadTracks(): void {
    this.answerService.getTracks().subscribe((data: any) => {
      console.log(data)
      this.tracks = data.result;
    }, (error: any) => {
      console.error('Error loading themes', error);
      this.utils.showMessage('Erro ao carregar os temas. Por favor, tente novamente mais tarde.', true);
    }
    );
  }

  isAdmin() {
    return this.userService.isAdmin();
  }

  isLogged() {
    return this.userService.isLogged();
  }

  openPerformanceDialog(): void {
    const dialogRef = this.dialog.open(PerformanceDialogComponent, {
      data: this.stats
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  openAnsweredTracksDialog(): void {
    const dialogRef = this.dialog.open(AnsweredTracksDialogComponent, {
      data: this.tracks
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}
