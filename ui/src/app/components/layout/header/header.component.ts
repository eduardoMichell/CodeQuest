import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProfileComponent } from 'src/app/dialogs/profile/profile.component';
import { HeaderService } from 'src/app/services/header-service/header.service';
import { UserService } from 'src/app/services/user-service/user.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {



  constructor(
    private headerService: HeaderService,
    public dialog: MatDialog,
    private userService: UserService
  ) {
  }


  ngOnInit() {
  }


  openProfile() {
    this.dialog.open(ProfileComponent, {});

  }


  isLogged() {
    return this.userService.isLogged();
  }

  logout() {
    this.userService.cleanStorage();
    window.location.reload();
  }

  login() { 
    this.userService.login();
  }

  get title(): string {
    return this.headerService.headerData.title
  }

  get icon(): string {
    return this.headerService.headerData.icon
  }

  get routeUrl(): string {
    return this.headerService.headerData.routeUrl
  }

  userIsAdmin(){
    return this.userService.isAdmin();
  }

}
