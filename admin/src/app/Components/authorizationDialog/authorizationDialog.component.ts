import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';

import { AuthService } from 'src/app/auth.service';


@Component({
  selector: 'app-authorization-dialog',
  templateUrl: './authorizationDialog.component.html',
  styleUrls: ['./authorizationDialog.component.css']
})

export class AuthorizationDialogComponent {
  public emailFormControl: FormControl = new FormControl('', [
    Validators.required,
    Validators.email
  ]);

  public passwordFormControl: FormControl = new FormControl('', [
    Validators.required
  ]);

  public showWarning: boolean = false;

  public constructor(
    private readonly authService: AuthService,
    private readonly matDialogRef: MatDialogRef<AuthorizationDialogComponent>) {
  }

  public closeAuthDialog(): void {
    this.matDialogRef.close();
  }

  public loginClicked(email: string, password: string): void {
    this.authService.login(email, password)
    .subscribe(() => {
      this.closeAuthDialog();
    }, () => 
      this.showWarning = true
    );
  }
}