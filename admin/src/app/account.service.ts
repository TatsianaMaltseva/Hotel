import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private readonly apiUrl: string;
  
  public constructor(
    private readonly http: HttpClient
  ) { 
    this.apiUrl = environment.api;
  }

  public createAccount(email: string, password: string): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}api/accounts`,
      { email, password }
    );
  }
}