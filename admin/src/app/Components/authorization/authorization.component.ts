import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { AuthService } from 'src/app/auth.service';


@Component({
  selector: 'app-authorization',
  templateUrl: './authorization.component.html',
  styleUrls: ['./authorization.component.css']
})
export class AuthorizationComponent {
  
  public constructor(
    private readonly authService: AuthService,
    public dialogRef: MatDialogRef<AuthorizationComponent>) {
  }

  public backClicked(): void {
    this.dialogRef.close();
  }

  public loginClicked(email: string, password: string): void {
    this.authService.login(email, password)
    .subscribe(res => {}, error => { 
      alert('Wrong credentials!');
    });
    //some logic for processing wrong creds
  }
}
