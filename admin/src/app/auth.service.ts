import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { ACCESS_TOKEN_KEY } from './Core/getToken';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl: string;
  
  public constructor(
    private readonly http: HttpClient,
    private readonly jwtHelper: JwtHelperService
  ) { 
    this.apiUrl = environment.api;
  }

  public isLoggedIn(): boolean {
    let token: string | null = localStorage.getItem(ACCESS_TOKEN_KEY);
    return token !== null && !this.jwtHelper.isTokenExpired(token);
  }

  public login(email: string, password: string): Observable<string> {
    const options: Object = {
      responseType: 'text'
    };

    return this.http
      .post<string>(
        `${this.apiUrl}api/auth/login`, 
        { email, password },
        options
      )
      .pipe(
        tap((token: string) => {
          localStorage.setItem(ACCESS_TOKEN_KEY, token);
        })
      );
  }

  public register(email: string, password: string): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}api/users`,
      { email, password }
    );
  }

  public logout(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  }
}