import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddFacilitiesDialogComponent } from '../add-facilities-dialog/add-facilities-dialog.component';

import { CreateAdminComponent } from '../create-admin/create-admin.component';

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
      CreateAdminComponent,
      {
        width: '400px'
      }
    );
  }

  public addFacilityDialog(): void {
    this.matDialog.open(
      AddFacilitiesDialogComponent,
      {
        width: '400px'
      }
    );
  }
}
