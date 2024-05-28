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
    const storedUser = localStorage.getItem(USER_KEY);
    this.currentUserSubject = new BehaviorSubject<any>(storedUser ? JSON.parse(storedUser) : null);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  cleanStorage(): void {
    localStorage.clear();
  }

  public saveUser(user: any): void {
    this.cleanStorage();
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser(): any {
    const user = localStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user).user;
    }
    return {};
  }

  public isLogged(): boolean {
    const user = localStorage.getItem(USER_KEY);
    return !!user;
  }

  login(username: string, password: string) {
    return this.http.post<any>(API_URL + 'login', { email: username, password }, httpOptions).pipe(
      map((response: any) => {
        if (!response.error && response.result) {
          const user: any = response.result.user;
          this.saveUser({ token: response.result.token, user });
          this.currentUserSubject.next({ token: response.result.token, user });
        }
        return response;
      })
    );
  }

  logout() {
    this.cleanStorage();
    this.currentUserSubject.next(null);
  }

  public isAdmin() {
    const user = this.getUser();
    return user?.isAdmin || false;
  }

  public getToken(): any {
    const user = localStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user).token;
    }
    return {};
  }

  getStudents(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `${this.getToken()}`
    });
    return this.http.get<any>(`${API_URL}students`, { headers });
  }

  addStudents(students: any[]): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `${this.getToken()}`
    });
    return this.http.post<any>(`${API_URL}add-students`, students, { headers });
  }


  getStudentReport(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `${this.getToken()}`
    });
    return this.http.get<any>(`${API_URL}report`, { headers });
  }

}