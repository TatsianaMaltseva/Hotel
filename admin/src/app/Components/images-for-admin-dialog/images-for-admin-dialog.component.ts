import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ImageForAdminDialogData } from 'src/app/Core/image-dialog-admin-data';
import { Hotel } from 'src/app/Dtos/hotel';
import { Room } from 'src/app/Dtos/room';

@Component({
  selector: 'app-images-for-admin-dialog',
  templateUrl: './images-for-admin-dialog.component.html'
})
export class ImagesForAdminDialogComponent {
  public hotel: Hotel;
  public room: Room;
  public constructor(
    @Inject(MAT_DIALOG_DATA) public data: ImageForAdminDialogData
  ) { 
    this.room = data.room;
    this.hotel = data.hotel;
  }
}
