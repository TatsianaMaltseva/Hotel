import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ImageService } from 'src/app/image.service';
import { Image } from 'src/app/Dtos/image';
import { HotelService } from 'src/app/hotel.service';
import { RoomService } from '../room.service';
import { Room } from 'src/app/Dtos/room';

@Component({
  selector: 'app-images-for-admin',
  templateUrl: './images-for-admin.component.html',
  styleUrls: ['./images-for-admin.component.css']
})
export class ImagesForAdminComponent implements OnInit {
  public progress: number = 0;
  public images: Image[] = [];
  @Input() public hotelId?: number;
  @Input() public roomId?: number;


  public constructor(
    private readonly imageService: ImageService,
    private readonly snackBar: MatSnackBar,
    private readonly hotelService: HotelService,
    private readonly roomService: RoomService
  ) {
  }

  public ngOnInit(): void {
    this.fetchImages();
  }
  
  public createImagePath(image: Image): string {
    if (this.hotelId === undefined) {
      return '';
    }
    return this.imageService
      .createImagePath(
        this.hotelId, 
        image.id,
        this.roomId
      );
  }

  public addImage(imageId: number): void {
    this.images.push({ id: imageId } as Image);
  }

  public changeMainImage(image: Image): void {
    if (this.hotelId === undefined) {
      return;
    }
    let changeMain$: Observable<string>;
    if (this.roomId === undefined){
      changeMain$ = this.hotelService.changeMainImage(this.hotelId, image);
    } else {
      changeMain$ = this.roomService.changeMainImage(this.hotelId, image, this.roomId);
    }
    changeMain$      
      .subscribe(
        () => {
          this.openSnackBar('Main image was successfully changed');
        },
        (serverError: HttpErrorResponse) => {
          this.openSnackBar(serverError.error as string);
        }
      );
  }

  public deleteImage(image: Image): void {
    if (this.hotelId === undefined) {
      return;
    }
    this.imageService
      .deleteImage(this.hotelId, image.id, this.roomId)
      .subscribe(
        () => {
          this.images = this.images.filter(img => img !== image);
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
      .getImages(this.hotelId, this.roomId)
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
