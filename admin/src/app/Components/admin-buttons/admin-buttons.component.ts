import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { CreateAdminComponent } from '../create-admin/create-admin.component';

@Component({
  selector: 'app-admin-buttons',
  templateUrl: './admin-buttons.component.html'
})
export class AdminButtonsComponent {
  public constructor(
    private readonly matDialog: MatDialog
  ) { 
  }

  public openRegistrationDialog(): void {
    this.matDialog.open(
      CreateAdminComponent,
      {
        width: '400px'
      }
    );
  }
}
