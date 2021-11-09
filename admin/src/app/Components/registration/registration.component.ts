import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent{
  public registrationForm: FormGroup;
  public unsuccessWarning: boolean = false;

  public constructor(
    private readonly authService: AuthService,
    private readonly matDialogRef: MatDialogRef<RegistrationComponent>,
    private readonly formBuilder: FormBuilder,
    private readonly snackBar: MatSnackBar) {
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

  public get email(): AbstractControl | null {
    return this.registrationForm.get('email');
  }

  public get password(): AbstractControl | null {
    return this.registrationForm.get('password');
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

  public register(email: string, password: string): void {
    this.authService.register(email, password)
    .subscribe(
      () => {
        this.unsuccessWarning = false;
        this.openSuccessSnackBar('Successfully created!');
      },
      () => {
        this.unsuccessWarning = true;
      }
    );
  }
}