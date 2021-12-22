import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { roles } from './Core/roles';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private readonly apiUrl: string;

  public constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService
  ) { 
    this.apiUrl = environment.api;
  }
    
  public isAdmin(): boolean {
    return this.authService.role() === roles.admin;
  }

  public isClient(): boolean {
    return this.authService.role() === roles.client;
  }

  public id(): number | null {
    return this.authService.id();
  }

  public createAccount(email: string, password: string): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}api/accounts`,
      { email, password }
    );
  }

  public changePassword(oldPassword: string, newPassword: string): Observable<string> {
    return this.http
      .put<string>(
        `${this.apiUrl}api/accounts/${this.id()}`,
        { oldPassword, newPassword }
      );
  }
}