import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { AccountService } from 'src/app/account.service';
import { ConfirmValidParentMatcher, CustomValidators } from 'src/app/Core/customValidators';

@Component({
  selector: 'app-create-admin',
  templateUrl: './create-admin.component.html',
  styleUrls: ['./create-admin.component.css']
})

export class CreateAdminComponent {
  public createAdminForm: FormGroup;
  public hidePassword: boolean = true;
  public serverErrorResponse: string = '';
  public passwordValidator = new ConfirmValidParentMatcher('notSame');

  public get email(): AbstractControl | null {
    return this.createAdminForm.get('email');
  }

  public get password(): AbstractControl | null {
    return this.createAdminForm.get('password');
  }

  public get confirmPassword(): AbstractControl | null {
    return this.createAdminForm.get('confirmPassword');
  }

  public constructor(
    private readonly accountService: AccountService,
    private readonly matDialogRef: MatDialogRef<CreateAdminComponent>,
    private readonly formBuilder: FormBuilder,
    private readonly snackBar: MatSnackBar
  ) {
      this.createAdminForm = this.formBuilder.group({
        email: [
          '', 
          [
            Validators.required,
            Validators.email
          ]
        ],
        password: ['', [Validators.required]],
        confirmPassword: ['']
      },
      { validators: CustomValidators.match('password', 'confirmPassword') }
      );
  }

  public closeCreateAdminDialog(): void {
    this.matDialogRef.close();
  }
  
  public createAdmin(email: string, password: string ): void {
    this.accountService
      .createAccount(email, password)
      .subscribe(
        () => {
          this.serverErrorResponse = '';
          this.openSuccessSnackBar(`Successfully created! Email: ${email}`);
        },
        (serverError: HttpErrorResponse) => {
          this.serverErrorResponse = serverError.error as string;
        }
      );
  }
  
  private openSuccessSnackBar(message: string): void {
    this.snackBar.open(
      `${message}`,
      'Confirm'
    );
  }
}