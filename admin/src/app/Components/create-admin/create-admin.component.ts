import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';

import { AuthService } from 'src/app/auth.service';
import { ConfirmValidParentMatcher, CustomValidators } from 'src/app/Core/customValidators';

@Component({
  selector: 'app-create-admin',
  templateUrl: './create-admin.component.html',
  styleUrls: ['./create-admin.component.css']
})
export class CreateAdminComponent{
  public registrationForm: FormGroup;
  public hidePassword: boolean = true;
  public serverErrorResponse: string = '';
  public passwordValidator = new ConfirmValidParentMatcher('notSame');

  public get email(): AbstractControl | null {
    return this.registrationForm.get('email');
  }

  public get password(): AbstractControl | null {
    return this.registrationForm.get('password');
  }

  public get confirmPassword(): AbstractControl | null {
    return this.registrationForm.get('confirmPassword');
  }

  public constructor(
    private readonly authService: AuthService,
    private readonly matDialogRef: MatDialogRef<CreateAdminComponent>,
    private readonly formBuilder: FormBuilder,
    private readonly snackBar: MatSnackBar
    ) {
      this.registrationForm = this.formBuilder.group({
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

  public closeRegistrationDialog(): void {
    this.matDialogRef.close();
  }

  public openSuccessSnackBar(message: string): void {
    this.snackBar.open(
      `${message}`,
      'Confirm'
    );
  }

  public register(email: string, password: string ): void {
    this.authService
      .register(email, password, 'admin')
      .subscribe(
        () => {
          this.serverErrorResponse = '';
          this.openSuccessSnackBar(`Successfully created! Email: ${email}`);
        },
        (serverError: HttpErrorResponse) => {
          this.serverErrorResponse = serverError.error;
        }
      );
  }
}