import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthService } from 'src/app/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent{
  public registrationForm: FormGroup;
  public serverErrorResponse: string = '';

  public get email(): AbstractControl | null {
    return this.registrationForm.get('email');
  }

  public get password(): AbstractControl | null {
    return this.registrationForm.get('password');
  }

  public constructor(
    private readonly authService: AuthService,
    private readonly matDialogRef: MatDialogRef<RegistrationComponent>,
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
        password: ['', [Validators.required]]
      });
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
      .register(email, password)
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