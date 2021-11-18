import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';

import { AccountService } from 'src/app/account.service';

@Component({
  selector: 'app-create-admin',
  templateUrl: './create-admin.component.html',
  styleUrls: ['./create-admin.component.css']
})
export class CreateAdminComponent{
  public registrationForm: FormGroup;
  public serverErrorResponse: string = '';

  public get email(): AbstractControl | null {
    return this.registrationForm.get('email');
  }

  public get password(): AbstractControl | null {
    return this.registrationForm.get('password');
  }

  public constructor(
    private readonly matDialogRef: MatDialogRef<CreateAdminComponent>,
    private readonly formBuilder: FormBuilder,
    private readonly snackBar: MatSnackBar,
    private readonly accountService: AccountService
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

  public createAdmin(email: string, password: string ): void {
    this.accountService
      .createAccount(email, password)
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