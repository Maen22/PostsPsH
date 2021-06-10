import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { AuthData } from './auth-data.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticated = false;
  private token: string | undefined;
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient) {}

  createUser(email: string, password: string): void {
    const authData: AuthData = { email, password };

    this.http
      .post('http://localhost:3000/api/users/signup', authData)
      .subscribe((response) => {
        console.log(response);
      });
  }

  loginUser(email: string, password: string): void {
    const authData: AuthData = { email, password };
    this.http
      .post<{ token: string }>(
        'http://localhost:3000/api/users/login',
        authData
      )
      .subscribe((response) => {
        const token = response.token;
        this.token = token;
        if (token) {
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
        }
      });
  }

  getIsAuthenticated(): boolean {
    return this.isAuthenticated;
  }

  getToken(): string | undefined {
    return this.token;
  }

  getAuthStatusListener(): Observable<boolean> {
    return this.authStatusListener.asObservable();
  }
}
