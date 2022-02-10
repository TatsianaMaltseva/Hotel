import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { Role } from './Core/roles';
import { PageParameters } from './Core/page-parameters';
import { Params } from '@angular/router';
import { AccountsResponse } from './Core/accounts-response';
import { AccountFilterParams } from './Core/account-filter-params';
import { AccountToEdit } from './Dtos/account';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private readonly apiUrl: string;

  public get isAdmin(): boolean {
    return this.authService.role === Role.admin;
  }

  public get isClient(): boolean {
    return this.authService.role === Role.client;
  }

  public get accountId(): number | null {
    return this.authService.id;
  }

  public get email(): string | null {
    return this.authService.email;
  }

  public constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService
  ) {
    this.apiUrl = environment.api;
  }

  public createAccount(email: string, password: string): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}api/accounts`,
      { email, password }
    );
  }

  public changePassword(oldPassword: string, newPassword: string): Observable<string> {
    return this.http.put<string>(
        `${this.apiUrl}api/accounts/${this.accountId}/password`,
        { oldPassword, newPassword }
      );
  }

  public getAccounts(
    pageParameters: PageParameters,
    filterParams: AccountFilterParams
  ): Observable<AccountsResponse> {
    const params = { ...pageParameters, ...filterParams } as Params;
    return this.http.get<AccountsResponse>(
      `${this.apiUrl}api/accounts`,
      { params: params }
    );
  }

  public deleteAccount(accountId: number): Observable<string> {
    return this.http.delete<string>(
      `${this.apiUrl}api/accounts/${accountId}`
    );
  }

  public editAccount(accountId: number, account: AccountToEdit): Observable<string> {
    return this.http.put<string>(
      `${this.apiUrl}api/accounts/${accountId}`,
      account
    );
  }
}