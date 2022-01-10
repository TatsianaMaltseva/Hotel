import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { ImageDialogData } from 'src/app/Core/image-dialog-data';

@Component({
  selector: 'app-images-for-admin-dialog',
  templateUrl: './images-for-admin-dialog.component.html'
})
export class ImagesForAdminDialogComponent {
  public hotelId: number;
  public roomId: number;
  public constructor(
    private readonly matDialogRef: MatDialogRef<ImagesForAdminDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ImageDialogData
  ) { 
    this.roomId = data.roomId;
    this.hotelId = data.hotelId;
  }
}
