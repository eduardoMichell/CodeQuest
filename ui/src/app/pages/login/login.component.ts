import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user-service/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: string = "";
  password: string = "";
  error: string = "";

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    if (this.userService.currentUserValue) {
      this.router.navigate(['/home']);
    }
  }

  login() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(this.username) && this.password.length > 0) {
      this.userService.login(this.username, this.password).subscribe((data: any) => {
        if (!data.error && data.result.token) {
          this.router.navigate(['/home']);
        } else {
          this.error = data.message;
        }
      }, error => {
        this.error = error.error.message;
      }
      );
    } else {
      this.error = 'Please enter a valid email and password';
    }
  }
}
