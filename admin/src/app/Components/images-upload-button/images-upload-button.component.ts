import { HttpEventType } from '@angular/common/http';
import { Component, Input, Output, EventEmitter } from '@angular/core';

import { ImageForHotelService } from 'src/app/image-for-hotel.service';
import { ImageForFoomService } from '../image-for-foom.service';

@Component({
  selector: 'app-images-upload-button',
  templateUrl: './images-upload-button.component.html'
})
export class ImagesUploadButtonComponent {
  public progress: number = 0;
  @Input() public hotelId?: number;
  @Input() public roomId?: number;
  @Output() public imageLoaded = new EventEmitter<number>();

  public constructor(
    private readonly imageHotelService: ImageForHotelService,
    private readonly imageRoomService: ImageForFoomService
  ) {
  }

  public uploadFile(files: FileList | null): void {
    if (files?.length === 0 || this.hotelId === undefined) {
      return;
    }
    if (this.roomId === undefined) {
      this.uploadHotelImage(files, this.hotelId);
    } else {
      this.uploadRoomImage(files, this.hotelId, this.roomId);
    }
  }

  private uploadHotelImage(files: FileList | null, hotelId: number): void {
    this.imageHotelService
      .postImage(files, hotelId)
      .subscribe(
        (event) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progress = Math.round(100 * event.loaded / event.total); 
          } else if (event.type === HttpEventType.Response) {
            this.imageLoaded.emit(event.body as number);
          }
        }
    );
  }

  private uploadRoomImage(files: FileList | null, hotelId: number, roomId: number): void {
    this.imageRoomService
      .postImage(files, hotelId, roomId)
      .subscribe(
        (event) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progress = Math.round(100 * event.loaded / event.total); 
          } else if (event.type === HttpEventType.Response) {
            this.imageLoaded.emit(event.body as number);
          }
        }
    );
  }
}
