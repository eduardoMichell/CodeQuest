import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { lastValueFrom } from 'rxjs';
import { UserService } from 'src/app/services/user-service/user.service';
import { UtilsService } from 'src/app/services/utils-service/utils.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  name: string = "";
  email: string = "";

  password: string = "";
  confirmPassword: string = "";
  constructor(
    public dialogRef: MatDialogRef<RegisterComponent>,
    private userService: UserService,
    private utils: UtilsService,
    private http: HttpClient,
    public dialog: MatDialog
  ) {

  }

  async register() {
    
  }

 
}
