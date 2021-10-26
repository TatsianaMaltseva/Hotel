import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

import { API_URL } from './app-injection-tokens';
import { Token } from './Models/token';


export const ACCESS_TOKEN_KEY = 'hotels_access_token'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    @Inject(API_URL) private apiUrl: string,
    private jwtHelper: JwtHelperService,
    private router: Router
  ) { }

  login(email: string, password: string): Observable<Token> {
    return this.http.post<Token>(`${this.apiUrl}api/auth/login`, {
      email, password
    })
    .pipe(
      tap(token => {
        localStorage.setItem(ACCESS_TOKEN_KEY, `${token.access_token}`);
      })
    )
  }

  isAuthenticated(): boolean {
    var token = localStorage.getItem(ACCESS_TOKEN_KEY);
    return Boolean(token && !this.jwtHelper.isTokenExpired(token))
  }

  logout(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    this.router.navigate(['']);
  }
}
