import { Component, EventEmitter, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from 'src/app/auth.service';
import { ConfirmValidParentMatcher, CustomValidators } from 'src/app/Core/custom-validators';
import { AccountParams } from 'src/app/Core/validation-params';
import { ACCESS_TOKEN_KEY } from 'src/app/Core/get-token';
import { AccountService } from 'src/app/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  public registerForm: FormGroup;
  public hidePassword: boolean = true;
  public passwordsStateMatcher = new ConfirmValidParentMatcher('notSame');
  public passwordMinLength =  AccountParams.passwordMinLength;

  @Output() public returnBackEvent = new EventEmitter<void>();

  public get email(): AbstractControl | null {
    return this.registerForm.get('email');
  }

  public get password(): AbstractControl | null {
    return this.registerForm.get('password');
  }

  public get confirmPassword(): AbstractControl | null {
    return this.registerForm.get('confirmPassword');
  }

  public get isClient(): boolean {
    return this.accountService.isClient;
  }

  public constructor(
    private readonly authService: AuthService,
    private readonly formBuilder: FormBuilder,
    private readonly accountService: AccountService
  ) {
      this.registerForm = formBuilder.group(
        {
          email: [
            '',
            [
              Validators.required,
              Validators.email
            ]
          ],
          password: [
            '',
            [
              Validators.required,
              Validators.minLength(this.passwordMinLength)
            ]
          ],
          confirmPassword: ['']
        },
        {
          validators: CustomValidators.match('password', 'confirmPassword')
        }
      );
  }

  public returnBack(): void {
    this.returnBackEvent.emit();
  }

  public register(email: string, password: string): void {
    this.authService
      .register(email, password)
      .subscribe(
        (token: string) => {
          if (this.isClient) {
            localStorage.setItem(ACCESS_TOKEN_KEY, token);
            this.returnBack();
          }
        }
      );
  }
}