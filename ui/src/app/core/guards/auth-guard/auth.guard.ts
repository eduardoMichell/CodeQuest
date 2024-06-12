import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from 'src/app/services/user-service/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(private authService: UserService, private router: Router) {}

  canActivate(): boolean {
    const isAuthenticated = this.authService.isLogged();
    if (!isAuthenticated) {
      this.authService.logout();
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}