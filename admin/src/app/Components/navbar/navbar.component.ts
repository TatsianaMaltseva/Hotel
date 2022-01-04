import { Component } from '@angular/core';

import { AccountService } from 'src/app/account.service';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  public get isLoggedIn(): boolean {
    return this.authService.isLoggedIn;
  }

  public get isAdmin(): boolean {
    return this.accountService.isAdmin;
  }
  
  public constructor(
    private readonly authService: AuthService,
    private readonly accountService: AccountService
  ) {
  }
}