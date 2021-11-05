import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { AuthService } from 'src/app/auth.service';
import { AuthorizationDialogComponent } from '../authorizationDialog/authorizationDialog.component';

@Component({
  selector: 'app-authorization',
  templateUrl: './authorization.component.html',
  styleUrls: ['./authorization.component.css']
})
export class AuthorizationComponent {
  public get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  public constructor(
    private readonly authService: AuthService,
    private readonly matDialog: MatDialog) {
  }

  public logout(): void {
    this.authService.logout();
  }

  public login(): void {
    this.matDialog.open(
      AuthorizationDialogComponent,
      {
        width: '300px'
      }
    );
  }
}