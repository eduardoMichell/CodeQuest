import { Injectable } from '@angular/core';
import { environment } from "../../../environments/environment";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from '../user-service/user.service';

const API_URL = environment.API_URL + "/answer";


@Injectable({
  providedIn: 'root'
})
export class AnswerService {

  constructor(
    private http: HttpClient,
    private userService: UserService,
  ) { }

  saveAnswer(answer: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `${this.userService.getToken()}`,
    });
    return this.http.post<any>(`${API_URL}/save`, answer, { headers });
  }

  getRanking(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `${this.userService.getToken()}`,
    });
    return this.http.get<any>(`${API_URL}/ranking`, { headers });
  }

  getUserStats(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `${this.userService.getToken()}`,
    });
    return this.http.get<any>(`${API_URL}/stats`, { headers });
  }

  getTracks(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `${this.userService.getToken()}`,
    });
    return this.http.get<any>(`${API_URL}/tracks`, { headers });
  }

  getUserDetailedStats(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `${this.userService.getToken()}`,
    });
    return this.http.get<any>(`${API_URL}/user/detailed-stats`, { headers });
  }
}
