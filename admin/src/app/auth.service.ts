import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

import { environment } from 'src/environments/environment';


export const ACCESS_TOKEN_KEY: string = 'hotels_access_token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly apiUrl: string;
  
  public constructor(
    private readonly http: HttpClient,
    private readonly jwtHelper: JwtHelperService,
    private readonly router: Router
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

    return this.http.post<string>(
      `${this.apiUrl}api/auth/login`, 
      { email, password },
      options)
    .pipe(
      tap((token: string) => {
        localStorage.setItem(ACCESS_TOKEN_KEY, token);
      })
    );
  }

  public logout(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    this.router.navigate(['']);  //this path wil be written inside app-routing
  }
}