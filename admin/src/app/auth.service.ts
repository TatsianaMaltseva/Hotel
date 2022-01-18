import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { ACCESS_TOKEN_KEY, getToken } from './Core/get-token';

export interface Token {
  email: string;
  sub:  number;
  role: string;
  exp: number;
  iss: string;
  aud: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl: string;
  
  public get isLoggedIn(): boolean {
    const token: string | null = getToken();
    return token !== null && !this.jwtHelper.isTokenExpired(token);
  }

  public get role(): string | null {
    if (this.isLoggedIn) {
      return this.decodedToken.role;
    }
    return null;
  }

  public get id(): number | null {
    if (this.isLoggedIn) {
      return this.decodedToken.sub;
    }
    return null;
  }

  public get email(): string | null {
    if (this.isLoggedIn) {
      return this.decodedToken.email;
    }
    return null;
  }

  private get decodedToken(): Token {
    return this.jwtHelper.decodeToken(getToken()!);
  }

  public constructor(
    private readonly http: HttpClient,
    private readonly jwtHelper: JwtHelperService
  ) { 
    this.apiUrl = environment.api;
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
    const options: Object = {
      responseType: 'text'
    };
    
    return this.http
      .post<string>(
        `${this.apiUrl}api/auth/registration`,
        { email, password },
        options
      )
      .pipe(
        tap((token: string) => {
          localStorage.setItem(ACCESS_TOKEN_KEY, token);
        })
      );
  }

  public logout(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  }
}