import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { GameService } from 'src/app/services/game-service/game.service';
import { UserService } from 'src/app/services/user-service/user.service';

@Injectable({
  providedIn: 'root'
})
export class NonAdminGuard implements CanActivate {

  constructor(private authService: UserService, private router: Router) { }

  canActivate(): boolean {
    const isAdmin = this.authService.isAdmin();
    if (isAdmin) {
      this.router.navigate(['/home']);
      return false;
    }
    return true;
  }
}
