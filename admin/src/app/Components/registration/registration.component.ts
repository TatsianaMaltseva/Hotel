import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent{
  public registrationForm: FormGroup;


  public constructor(
    private readonly authService: AuthService,
    private readonly matDialogRef: MatDialogRef<RegistrationComponent>,
    private readonly formBuilder: FormBuilder) {
    this.registrationForm = this.formBuilder.group({
      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],
      password: ['', [Validators.required]],
      confirmPassword: ['', Validators.required]
    });
  }

  public get email(): AbstractControl | null {
    return this.registrationForm.get('email');
  }

  public get password(): AbstractControl | null {
    return this.registrationForm.get('password');
  }

  public get confirmPassword(): AbstractControl | null {
    return this.registrationForm.get('congirmPassword');
  }

  public closeRegistrationDialog(): void {
    this.matDialogRef.close();
  }

  public register(): void {
    console.log('as if registration works');
  }
}
