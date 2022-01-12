import { Component, EventEmitter, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { AuthService } from 'src/app/auth.service';
import { ConfirmValidParentMatcher, CustomValidators } from 'src/app/Core/custom-validators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  public registerForm: FormGroup;
  public hidePassword: boolean = true;
  public serverErrorResponse: string = '';
  public passwordsStateMatcher = new ConfirmValidParentMatcher('notSame');
  
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

  public constructor(
    private readonly authService: AuthService,
    private readonly formBuilder: FormBuilder
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
          password: ['', Validators.required],
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
        () => {
          this.serverErrorResponse = '';
          this.returnBack();
        },
        (serverError: HttpErrorResponse) => {
          this.serverErrorResponse = serverError.error as string;
        }
      );
  }
}