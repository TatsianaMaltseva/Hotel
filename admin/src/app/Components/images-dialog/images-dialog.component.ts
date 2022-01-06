import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface ImageDialodData {
  hotelId: number;
  roomId: number;
}

@Component({
  selector: 'app-images-dialog',
  templateUrl: './images-dialog.component.html'
})
export class ImagesDialogComponent {
  public hotelId: number;
  public roomId: number;
  public constructor(
    private readonly matDialogRef: MatDialogRef<ImagesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ImageDialodData
  ) { 
    this.roomId = data.roomId;
    this.hotelId = data.hotelId;
  }
}
