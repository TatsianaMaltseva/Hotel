import { Component, Input, OnInit } from '@angular/core';

import { ImageService } from 'src/app/image.service';
import { Image } from 'src/app/Dtos/image';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-images-for-admin',
  templateUrl: './images-for-admin.component.html',
  styleUrls: ['./images-for-admin.component.css']
})
export class ImagesForAdminComponent implements OnInit {
  public progress: number = 0;
  public images: Image[] = [];
  @Input() public hotelId?: number;

  public constructor(
    private readonly imageService: ImageService,
    private readonly snackBar: MatSnackBar
  ) { 
  }

  public ngOnInit(): void {
    this.fetchImages();
  }
  
  public createImagePath(image: Image): string {
    if (this.hotelId === undefined) {
      return '';
    }
    return this.imageService.createImagePath(this.hotelId, image);
  }

  public addImage(imageId: number): void {
    this.images.push({ id: imageId } as Image);
  }

  public deleteImage(image: Image): void {
    if (this.hotelId === undefined) {
      return;
    }
    this.imageService
      .deleteImage(this.hotelId, image)
      .subscribe(
        () => {
          const id = this.images.indexOf(image);
          delete this.images[id];
          this.images.length -= 1;
          this.openSnackBar('Image was successfully deleted');
        },
        (serverError: HttpErrorResponse) => {
          this.openSnackBar(serverError.error as string);
        }
      );
  }

  private fetchImages(): void {
    if (this.hotelId === undefined) {
      return;
    }
    this.imageService
      .getImages(this.hotelId)
      .subscribe(images => this.images = images);
  }

  private openSnackBar(message: string): void {
    this.snackBar.open(
      `${message}`,
      'Close',
      {
        duration: 5000
      }
    );
  }
}
