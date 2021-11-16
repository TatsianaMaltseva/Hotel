import { Component, Input } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from 'src/app/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CustomValidators } from 'src/app/Core/customValidators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  public authForm: FormGroup;
  public showWarning: boolean = false;
  public hidePassword: boolean = true;
  public serverErrorResponse: string = '';

  @Input() public closeAuthDialog!: Function;
  
  public get email(): AbstractControl | null {
    return this.authForm.get('email');
  }

  public get password(): AbstractControl | null {
    return this.authForm.get('password');
  }

  public get confirmPassword(): AbstractControl | null {
    return this.authForm.get('confirmPassword');
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
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    },
    { validators: CustomValidators.match('password', 'confirmPassword') }
    );
  }

  public registerClient(email: string, password: string): void {
    this.authService
      .register(email, password, 'client')
      .subscribe(
        () => {
          this.serverErrorResponse = '';
          this.authService.login(email, password).subscribe();
          this.closeAuthDialog();
        },
        (serverError: HttpErrorResponse) => {
          this.serverErrorResponse = serverError.error as string;
        }
      );
  }
}