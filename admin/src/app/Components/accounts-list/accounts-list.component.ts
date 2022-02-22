import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';

import { AccountService } from 'src/app/account.service';
import { AccountFilterParams } from 'src/app/Core/account-filter-params';
import { AccountsResponse } from 'src/app/Core/accounts-response';
import { PageParameters } from 'src/app/Core/page-parameters';
import { Role } from 'src/app/Core/roles';
import { AccountParams } from 'src/app/Core/validation-params';
import { Account } from 'src/app/Dtos/account';
import { AccountComponent } from '../account/account.component';
import { CreateAdminComponent } from '../create-admin/create-admin.component';
import { RegisterComponent } from '../register/register.component';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts-list.component.html',
  styleUrls: ['./accounts-list.component.css']
})
export class AccountsListComponent implements OnInit {
  public accounts: Account[] = [];
  public accountCount: number = 0;
  public pageParameters: PageParameters = {
    pageSize: 10,
    pageIndex:  0
  };
  public filterForm: FormGroup;
  public roleOptions = [Role.admin, Role.client];

  public get email(): AbstractControl | null {
    return this.filterForm.get('email');
  }

  public get role(): AbstractControl | null {
    return this.filterForm.get('role');
  }

  public get adminId(): number | null {
    return this.accountService.accountId;
  }

  public constructor(
    private readonly matDialog: MatDialog,
    private readonly accountService: AccountService,
    private readonly formBuilder: FormBuilder
  ) {
    this.filterForm = formBuilder.group(
      {
        email: [null, [Validators.maxLength(AccountParams.emailMaxLength)]],
        role: null
      }
    );
  }

  public ngOnInit(): void {
    this.fetchAccounts();
  }

  public openAddAdminDialog(): void {
    this.matDialog.open(
      CreateAdminComponent,
      {
        width: '400px'
      }
    );
  }

  public openAddClientDialog(): void {
    this.matDialog.open(
      RegisterComponent,
      {
        width: '400px'
      }
    );
  }

  public openEditAccountDialog(account: Account): void {
    this.matDialog.open(
      AccountComponent,
      {
        width: '400px',
        data: account
      }
    );
  }

  public onPaginationChange(event: PageEvent): void {
    this.pageParameters = event as PageParameters;
    this.fetchAccounts();
  }

  public fetchAccounts(): void {
    const filterParams = Object.fromEntries(
      Object.entries(this.filterForm.value as AccountFilterParams)
      .filter(([_, value]) => value)
    );

    this.accountService
      .getAccounts(this.pageParameters, filterParams)
      .subscribe(
        (response: AccountsResponse) => {
          this.accounts = response.accounts;
          this.accountCount = response.accountCount;
        }
      );
  }

  public deleteAccount(accountId: number): void {
    this.accountService
      .deleteAccount(accountId)
      .subscribe(
        () => {
          this.fetchAccounts();
        }
      );
  }
}
