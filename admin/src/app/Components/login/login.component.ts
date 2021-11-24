import { Component, EventEmitter, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  public authForm: FormGroup;
  public showWarning: boolean = false;
  public hidePassword: boolean = true;

  @Output() public closeDialogEvent = new EventEmitter();

  public get email(): AbstractControl | null {
    return this.authForm.get('email');
  }

  public get password(): AbstractControl | null {
    return this.authForm.get('password');
  }

  public constructor(
    private readonly authService: AuthService,
    private readonly formBuilder: FormBuilder
  ) {
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

  public closeAuthDialog(): void {
    this.closeDialogEvent.emit();
  }

  public login(email: string, password: string): void {
    this.authService
      .login(email, password)
      .subscribe(
        () => { 
          this.closeAuthDialog();
        },
        () => this.showWarning = true
      );
  }
}