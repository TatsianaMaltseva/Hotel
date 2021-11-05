import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent{

  public constructor(
    private readonly authService: AuthService,
    private readonly matDialogRef: MatDialogRef<RegistrationComponent>
  ) { }

  public closeRegistrationDialog(): void {
    this.matDialogRef.close();
  }

  public register(): void {
    console.log('as if registration works');
  }
}
