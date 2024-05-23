import { AfterContentInit, Component } from '@angular/core';
import { HeaderService } from 'src/app/services/header-service/header.service';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from 'src/app/services/user-service/user.service';
import { SelectGameComponent } from 'src/app/components/game/select-game/select-game.component';
import { RankingComponent } from 'src/app/components/game/ranking/ranking.component';
import { GameService } from 'src/app/services/game-service/game.service';
import { Router } from '@angular/router';
import { StudentsDialogComponent } from 'src/app/dialogs/students-dialog/students-dialog.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterContentInit {


  constructor(
    private headerService: HeaderService,
    public dialog: MatDialog,
    private userService: UserService,
    private gameService: GameService,
    private router: Router,
  ) {
  }

  async ngAfterContentInit(): Promise<void> {
    this.gameService.setGame(null);
    this.headerService.headerData = {
      title: 'Tela Inicial',
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

  play() {
    this.dialog.open(SelectGameComponent, {});
  }

  ranking() {
    this.dialog.open(RankingComponent, {});
  }

  consult(){
    this.router.navigate(['/consult']);
  }

  gameSettings(){
    this.router.navigate(['/settings']);
  }

  students(){
    this.dialog.open(StudentsDialogComponent, {});
  }

}
