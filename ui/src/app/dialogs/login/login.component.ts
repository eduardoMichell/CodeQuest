import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UserService } from 'src/app/services/user-service/user.service';
import { environment } from "../../../environments/environment";
import { UtilsService } from 'src/app/services/utils-service/utils.service';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { RegisterComponent } from '../register/register.component';

const API_URL = environment.API_URL + "/auth/";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = "";
  password: string = "";
  constructor(
    public dialogRef: MatDialogRef<LoginComponent>,
    private userService: UserService,
    private utils: UtilsService,
    private http: HttpClient,
    public dialog: MatDialog
  ) {

  }

  async login() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(this.email) && this.password.length > 0) {
     try{
      const response: any = await lastValueFrom(this.http.post(API_URL + 'login', { email: this.email, password: this.password }));
      if(!response.error){
        this.userService.saveUser({token: response.result.token, user: response.result.user});
        this.dialogRef.close();
      }
    } catch (err: any){
      this.utils.showMessage(err.error.message, true);
     }
    } else {
      this.utils.showMessage("All fields must be filled out", true);
    }
  }

  register(){
    this.dialogRef.close();
    this.dialog.open(RegisterComponent, {});
  }
}
