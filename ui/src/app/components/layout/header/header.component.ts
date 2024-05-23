import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { HeaderService } from 'src/app/services/header-service/header.service';
import { UserService } from 'src/app/services/user-service/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  isHome: boolean = true;

  constructor(
    private headerService: HeaderService,
    public dialog: MatDialog,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.isHome = event.urlAfterRedirects === '/home';
    });
  }

  isLogged() {
    return this.userService.isLogged();
  }

  logout() {
    this.userService.logout();
    window.location.reload();
  }

  get title(): string {
    return this.headerService.headerData.title;
  }

  get icon(): string {
    return this.headerService.headerData.icon;
  }

  get routeUrl(): string {
    return this.headerService.headerData.routeUrl;
  }

  userIsAdmin() {
    return this.userService.isAdmin();
  }

  goBack(): void {
    this.router.navigate(['home']);
  }
}
