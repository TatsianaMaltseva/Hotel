import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RegistrationComponent } from '../registration/registration.component';

@Component({
  selector: 'app-admin-buttons',
  templateUrl: './admin-buttons.component.html',
  styleUrls: ['./admin-buttons.component.css']
})
export class AdminButtonsComponent {

  public constructor(
    private readonly matDialog: MatDialog
  ) {

  }
  public openRegistrationDialog(): void {
    this.matDialog.open(
      RegistrationComponent,
      {
        width: '300px'
      }
    );
  }
}
