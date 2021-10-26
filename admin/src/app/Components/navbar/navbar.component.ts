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
    return this.authService.isAuthenticated()
  }

  constructor(
    private authService: AuthService,
    public dialog: MatDialog) {
  }

  logout() {
    this.authService.logout()
  }

  openDialog(): void {
    this.dialog.open(AuthorizationComponent, {
      width: '250px',
    });
  }
}