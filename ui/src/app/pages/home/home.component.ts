import { Component } from '@angular/core';
import { HeaderService } from 'src/app/services/header-service/header.service';
import { Observable, lastValueFrom } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from 'src/app/services/user-service/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {


  constructor(
    private headerService: HeaderService,
    public dialog: MatDialog,
    private userService: UserService
  ) { 
  }

  async ngOnInit(): Promise<void> {
    console.log(this.userService.currentUserValue)

    this.headerService.headerData = {
      title: 'Tela Inicial',
      icon: '',
      routeUrl: ''
    };
  }

 
  isAdmin(){
    return this.userService.isAdmin();
  }

}
