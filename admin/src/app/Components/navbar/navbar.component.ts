import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { AuthService } from 'src/app/auth.service';
import { AuthorizationComponent } from '../authorization/authorization.component';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  public get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  public constructor(
    private readonly authService: AuthService,
    public authDialog: MatDialog) {
  }

  public logoutClicked(): void {
    this.authService.logout();
  }

  public loginClicked(): void {
    this.authDialog.open(AuthorizationComponent, {
      width: '250px'
    });
  }
}