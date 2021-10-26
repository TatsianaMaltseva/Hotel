import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { AuthService } from 'src/app/auth.service';


@Component({
  selector: 'app-authorization',
  templateUrl: './authorization.component.html',
  styleUrls: ['./authorization.component.css']
})
export class AuthorizationComponent {
  
  constructor(private authService: AuthService,
    public dialogRef: MatDialogRef<AuthorizationComponent>) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  login (email: string, password: string) {
    this.authService.login(email, password)
    .subscribe (res => {
    }, error => { 
      alert('Wrong credentials!')
    })
  }

}
