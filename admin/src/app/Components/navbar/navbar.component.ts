import { Component } from '@angular/core';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  public get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  public get role(): string | null {
    return this.authService.role();
  }

  public get isAdmin(): boolean {
    return this.isLoggedIn && this.role === 'admin';
  }
  
  public constructor(
    private readonly authService: AuthService
  ) {
  }
}