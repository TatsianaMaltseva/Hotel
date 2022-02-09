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
import { CreateAdminComponent } from '../create-admin/create-admin.component';
import { RegisterComponent } from '../register/register.component';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit {
  public accounts: Account[] = [];
  public accountCount: number = 0;
  public pageParameters: PageParameters = {
    pageSize: 10,
    pageIndex:  0
  };
  public filterForm: FormGroup;
  public roleOptions = [Role.admin, Role.client];

  public get id(): AbstractControl | null {
    return this.filterForm.get('id');
  }

  public get email(): AbstractControl | null {
    return this.filterForm.get('email');
  }

  public get role(): AbstractControl | null {
    return this.filterForm.get('role');
  }

  public constructor(
    private readonly matDialog: MatDialog,
    private readonly accountService: AccountService,
    private readonly formBuilder: FormBuilder
  ) {
    this.filterForm = formBuilder.group(
      {
        id: [''],
        email: ['', [Validators.maxLength(AccountParams.emailMaxLength)]],
        role: ['']
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

  public openClientAdminDialog(): void {
    this.matDialog.open(
      RegisterComponent,
      {
        width: '400px'
      }
    );
  }

  public onPaginationChange(event: PageEvent): void {
    this.pageParameters.pageIndex = event.pageIndex;
    this.pageParameters.pageSize = event.pageSize;
    this.fetchAccounts();
  }

  public fetchAccounts(): void {
    this.accountService
      .getAccounts(this.pageParameters, this.filterForm.value as AccountFilterParams)
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
          this.accounts = this.accounts
            .filter(account => account.id !== accountId);
        }
      );
  }
}
