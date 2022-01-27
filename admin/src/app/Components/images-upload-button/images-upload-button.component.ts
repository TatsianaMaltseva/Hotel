import { HttpEventType } from '@angular/common/http';
import { Component, Input, Output, EventEmitter } from '@angular/core';

import { ImageService } from 'src/app/image.service';

@Component({
  selector: 'app-images-upload-button',
  templateUrl: './images-upload-button.component.html',
  styleUrls: ['./images-upload-button.component.css']
})
export class ImagesUploadButtonComponent {
  @Input() public hotelId?: number;
  @Input() public roomId?: number;
  @Output() public imageLoaded = new EventEmitter<number>();

  public progress: number = 0;
  
  public constructor(
    private readonly imageService: ImageService
  ) {
  }

  public uploadFile(files: FileList | null): void {
    if (files?.length === 0 || this.hotelId === undefined) {
      return;
    }
    this.imageService
      .postImage(files, this.hotelId, this.roomId)
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
