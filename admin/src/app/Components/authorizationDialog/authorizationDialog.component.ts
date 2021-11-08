import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-authorization-dialog',
  templateUrl: './authorizationDialog.component.html',
  styleUrls: ['./authorizationDialog.component.css']
})

export class AuthorizationDialogComponent {
  public authForm: FormGroup;
  public showWarning: boolean = false;
  public hidePassword: boolean = true;

  public constructor(
    private readonly authService: AuthService,
    private readonly matDialogRef: MatDialogRef<AuthorizationDialogComponent>,
    private readonly formBuilder: FormBuilder) {
    this.authForm = this.formBuilder.group({
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
    return this.authForm.get('email');
  }

  public get password(): AbstractControl | null {
    return this.authForm.get('password');
  }

  public closeAuthDialog(): void {
    this.matDialogRef.close();
  }

  public login(email: string, password: string): void {
    this.authService.login(email, password)
    .subscribe(
      () => { 
        this.closeAuthDialog();
      }, 
      () => this.showWarning = true
    );
  }
}