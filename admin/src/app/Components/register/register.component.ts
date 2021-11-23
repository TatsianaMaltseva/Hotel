import { Component, Input } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { AuthService } from 'src/app/auth.service';
import { ConfirmValidParentMatcher, CustomValidators } from 'src/app/Core/customValidators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  public registerForm: FormGroup;
  public hidePassword: boolean = true;
  public serverErrorResponse: string = '';
  public passwordValidator = new ConfirmValidParentMatcher('notSame');

  @Input() public closeAuthDialog!: Function;
  
  public get email(): AbstractControl | null {
    return this.registerForm.get('email');
  }

  public get password(): AbstractControl | null {
    return this.registerForm.get('password');
  }

  public get confirmPassword(): AbstractControl | null {
    return this.registerForm.get('confirmPassword');
  }

  public constructor(
    private readonly authService: AuthService,
    private readonly formBuilder: FormBuilder
  ) {
      this.registerForm = this.formBuilder.group({
        email: [
          '', 
          [
            Validators.required,
            Validators.email
          ]
        ],
        password: ['', Validators.required],
        confirmPassword: ['']
      },
      { validators: CustomValidators.match('password', 'confirmPassword') }
      );
  }

  public register(email: string, password: string): void {
    this.authService
      .register(email, password)
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