import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AccountService } from 'src/app/account.service';
import { ConfirmValidParentMatcher, CustomValidators } from 'src/app/Core/customValidators';

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
      this.changePasswordForm = this.formBuilder.group(
        {
          oldPassword: ['', Validators.required],
          newPassword: ['', Validators.required],
          confirmNewPassword: ['']
        },
        {
          validators: CustomValidators.match('newPassword', 'confirmNewPassword')
        }
      );
  }

  public changePassword(oldPassword: string, newPassword: string): void {
    this.accountService
      .changePassword(oldPassword, newPassword)
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
      'Confirm',
      { 
        duration: 5000
      }
    );
  }
}
