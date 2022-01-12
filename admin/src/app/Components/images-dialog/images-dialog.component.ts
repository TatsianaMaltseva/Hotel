import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ImageDialogData } from 'src/app/Core/image-dialog-data';

@Component({
  selector: 'app-images-dialog',
  templateUrl: './images-dialog.component.html'
})
export class ImagesDialogComponent {
  public hotelId: number;
  public roomId: number;
  public constructor(
    @Inject(MAT_DIALOG_DATA) public data: ImageDialogData
  ) { 
    this.roomId = data.roomId;
    this.hotelId = data.hotelId;
  }
}
