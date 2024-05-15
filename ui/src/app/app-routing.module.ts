import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from './core/guards/auth-guard/auth.guard';
import { GameComponent } from './pages/game/game.component';
import { NonAdminGuard } from './core/guards/nonAdmin-guard/non-admin.guard';
import { PhaseComponent } from './pages/phase/phase.component';
import { ConsultComponent } from './pages/consult/consult.component';
 

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'consult',
    component: ConsultComponent,
    canActivate: [AuthGuard, NonAdminGuard]
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'game',
    component: GameComponent,
    canActivate: [AuthGuard, NonAdminGuard]
  },
  {
    path: 'game/phase',
    component: PhaseComponent,
    canActivate: [AuthGuard, NonAdminGuard]
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
