import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'admin';
  public get isLoggedIn() : boolean {
    return this.authService.isAuthenticated()
  }

  constructor(private authService: AuthService){
  }

  login (email: string, password: string) {
    this.authService.login(email, password)
    .subscribe (res => {

    }, error => { 
      alert('Wrong credentials!')
    })
  }

  logout() {
    this.authService.logout()
  }
}
