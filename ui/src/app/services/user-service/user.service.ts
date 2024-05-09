import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from "../../../environments/environment";
import { map } from 'rxjs/operators';

const USER_KEY = 'auth-user';

const API_URL = environment.API_URL + "/auth/";


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;
  constructor(
    public dialog: MatDialog,
    private http: HttpClient
  ) {
    const userJson = localStorage.getItem(USER_KEY) as string;
    const user = JSON.parse(userJson);
    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(user));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  cleanStorage(): void {
    window.sessionStorage.clear();
  }

  public saveUser(user: any): void {
    this.cleanStorage();
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }


  public getUser(): any {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user).user;
    }
    return {};
  }

  public isLogged(): boolean {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return true;
    }

    return false;
  }
 

  login(username: string, password: string) {
    return this.http.post<any>(API_URL + 'login', { email:username, password }).pipe(
      map((response: any) => {
        if (!response.error) {
          const user: any = response.result.user
          this.saveUser({ token: response.result.token, user });
          this.currentUserSubject.next(user);
        }
        console.log(response)
        return response;
      })
    );
  }

  public isAdmin() {
    const user = this.getUser() || {};
    return user?.isAdmin || false;
  }

  logout() {
    this.cleanStorage();
    this.currentUserSubject.next(null);
  }

}
