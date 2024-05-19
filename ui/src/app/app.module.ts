import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/layout/header/header.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './pages/home/home.component';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatListModule } from "@angular/material/list";
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientModule } from "@angular/common/http";
import { MatDialogModule } from "@angular/material/dialog";
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { LoginComponent } from './pages/login/login.component';
import { SelectGameComponent } from './components/game/select-game/select-game.component';
import { RankingComponent } from './components/game/ranking/ranking.component';
import { GameComponent } from './pages/game/game.component';
import { PhaseComponent } from './pages/phase/phase.component';
import { ResultDialogComponent } from './dialogs/result-dialog/result-dialog.component';
import { FinishDialogComponent } from './dialogs/finish-dialog/finish-dialog.component';
import { ConsultComponent } from './pages/consult/consult.component';
import { PerformanceDialogComponent } from './dialogs/performance-dialog/performance-dialog.component';
import { AnsweredTracksDialogComponent } from './dialogs/answered-tracks-dialog/answered-tracks-dialog.component';
import { GameSettingsComponent } from './pages/game-settings/game-settings.component';
import { ViewTracksComponent } from './dialogs/view-tracks/view-tracks.component';
import { TrackDialogComponent } from './dialogs/track-dialog/track-dialog.component';
import { FromCharCodePipe } from './core/pipes/from-char-code.pipe';
import { MatSelectModule } from '@angular/material/select'; 
import { ReactiveFormsModule } from '@angular/forms';
import { StudentsDialogComponent } from './dialogs/students-dialog/students-dialog.component';
import { MatTableModule } from '@angular/material/table';
import { CreateStudentsDialogComponent } from './dialogs/create-students-dialog/create-students-dialog.component';
import { MatCheckboxModule } from '@angular/material/checkbox';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    LoginComponent,
    SelectGameComponent,
    RankingComponent,
    GameComponent,
    PhaseComponent,
    ResultDialogComponent,
    FinishDialogComponent,
    ConsultComponent,
    PerformanceDialogComponent,
    AnsweredTracksDialogComponent,
    GameSettingsComponent,
    ViewTracksComponent,
    TrackDialogComponent,
    FromCharCodePipe,
    StudentsDialogComponent,
    CreateStudentsDialogComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NoopAnimationsModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatSnackBarModule,
    HttpClientModule,
    MatDialogModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    HttpClientModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatTableModule,
    MatCheckboxModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
