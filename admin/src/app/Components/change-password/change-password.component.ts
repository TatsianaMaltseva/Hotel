import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AccountService } from 'src/app/account.service';
import { ConfirmValidParentMatcher, CustomValidators } from 'src/app/Core/custom-validators';
import { AccountParams } from 'src/app/Core/validation-params';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent{
  public changePasswordForm: FormGroup;
  public hidePassword: boolean = true;
  public serverErrorResponse: string = '';
  public passwordsStateMatcher = new ConfirmValidParentMatcher('notSame');
  public passwordMinLength = AccountParams.passwordMinLength;

  public get oldPassword(): AbstractControl | null {
    return this.changePasswordForm.get('oldPassword');
  }

  public get newPassword(): AbstractControl | null {
    return this.changePasswordForm.get('newPassword');
  }

  public get confirmNewPassword(): AbstractControl | null {
    return this.changePasswordForm.get('confirmNewPassword');
  }

  public constructor(
    private readonly accountService: AccountService,
    private readonly formBuilder: FormBuilder,
    private readonly snackBar: MatSnackBar,
    private readonly location: Location
  ) {
      this.changePasswordForm = formBuilder.group(
        {
          oldPassword: ['', [Validators.required]],
          newPassword: [
            '',
            [
              Validators.required,
              Validators.minLength(this.passwordMinLength)
            ]
          ],
          confirmNewPassword: ['']
        },
        {
          validators: CustomValidators.match('newPassword', 'confirmNewPassword')
        }
      );
  }

  public changePassword(): void {
    this.accountService
      .changePassword(this.oldPassword?.value as string, this.newPassword?.value as string)
      .subscribe(
        () => {
          this.serverErrorResponse = '';
          this.openSuccessSnackBar('Password was successfully changed!');
          this.location.back();
        },
        (serverError: HttpErrorResponse) => {
          this.serverErrorResponse = serverError.error as string;
        }
      );
  }

  private openSuccessSnackBar(message: string): void {
    this.snackBar.open(
      `${message}`,
      'Close',
      {
        duration: 5000
      }
    );
  }
}