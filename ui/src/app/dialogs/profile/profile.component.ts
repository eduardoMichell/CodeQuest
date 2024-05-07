import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from 'src/app/services/user-service/user.service';
import { UtilsService } from 'src/app/services/utils-service/utils.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  user: any = null;
  name: any = null;
  email: any = null;
  oldPassword: any = null;
  newPassword: any = null;  
  constructor(
    public dialogRef: MatDialogRef<ProfileComponent>,
    private userService: UserService

  ) {
  }


  ngOnInit(){
    this.initUser();
  }

  initUser(){
    this.user = this.userService.getUser();

    console.log(this.user)
    this.name = this.user.name || "";
    this.email = this.user.email || "";
  }

  updateUser(){

  }

  
  closeDialog() {
    this.dialogRef.close();
  }

  changePassword(){
    
  }
}