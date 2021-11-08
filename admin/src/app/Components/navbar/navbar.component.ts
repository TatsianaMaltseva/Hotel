import { Component } from '@angular/core';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  public constructor(
    private readonly authService: AuthService) {
  }
  
  public get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
}