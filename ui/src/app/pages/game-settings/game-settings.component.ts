import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ViewTracksComponent } from 'src/app/dialogs/view-tracks/view-tracks.component';
import { GameService } from 'src/app/services/game-service/game.service';
import { HeaderService } from 'src/app/services/header-service/header.service';
import { UserService } from 'src/app/services/user-service/user.service';

@Component({
  selector: 'app-game-settings',
  templateUrl: './game-settings.component.html',
  styleUrls: ['./game-settings.component.css']
})
export class GameSettingsComponent implements OnInit {


  constructor(
    private headerService: HeaderService,
    public dialog: MatDialog,
    private userService: UserService,
    private gameService: GameService,
    private router: Router,
  ) {
  }
  
  ngOnInit() {
    this.gameService.setGame(null);
    this.headerService.headerData = {
      title: 'Configurações de Jogo',
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
  openCreatedTracksDialog(): void {
    const dialogRef = this.dialog.open(ViewTracksComponent, {
      data: {
        tracks: [
          { theme: 'Matemática', difficulty: 'Fácil' },
          { theme: 'História', difficulty: 'Médio' },
          { theme: 'Ciências', difficulty: 'Difícil' }
        ]
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  openCreateTrackDialog(): void {
    this.gameService.openTrackDialog(false);
  }



}
