import { Component, Inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AccountService } from 'src/app/account.service';

import { Role } from 'src/app/Core/roles';
import { AccountParams } from 'src/app/Core/validation-params';
import { Account, AccountToEdit } from 'src/app/Dtos/account';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent {
  public accountForm: FormGroup;
  public readonly roleOptions = [Role.admin, Role.client];

  public get email(): AbstractControl | null {
    return this.accountForm.get('email');
  }

  public get role(): AbstractControl | null {
    return this.accountForm.get('role');
  }

  public get password(): AbstractControl | null {
    return this.accountForm.get('password');
  }

  public constructor(
    @Inject(MAT_DIALOG_DATA) public account: Account,
    private readonly accountService: AccountService,
    private readonly formBuilder: FormBuilder
  ) {
      this.accountForm = formBuilder.group({
        email: [
          account.email,
          [
            Validators.required,
            Validators.email,
            Validators.maxLength(AccountParams.emailMaxLength)
          ]
        ],
        role: [account.role, [Validators.required]],
        password: ['', [Validators.minLength(AccountParams.passwordMinLength)]]
      }
    );
  }

  public checkIfHasMinError(controlName: string): boolean | undefined {
    return this.accountForm.get(controlName)?.hasError('minlength');
  }

  public editAccount(): void {
    this.accountService.editAccount(this.account.id, this.accountForm.value as AccountToEdit)
    .subscribe();
  }
}
