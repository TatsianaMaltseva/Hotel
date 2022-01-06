import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';

import { ImageForHotelService } from 'src/app/image-for-hotel.service';
import { Image } from 'src/app/Dtos/image';
import { HotelService } from 'src/app/hotel.service';
import { ImageForFoomService } from '../image-for-foom.service';
import { RoomService } from '../room.service';

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
    private readonly imageHotelService: ImageForHotelService,
    private readonly imageRoomService: ImageForFoomService,
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
    if (this.roomId === undefined) {
      return this.imageHotelService.createImagePath(this.hotelId, image.id);
    }
    return this.imageRoomService
      .createImagePath(
        this.hotelId, 
        this.roomId!, 
        image.id
      );
  }

  public addImage(imageId: number): void {
    this.images.push({ id: imageId } as Image);
  }

  public deleteImage(image: Image): void {
    if (this.hotelId === undefined) {
      return;
    }
    this.deleteHotelImage(this.hotelId, image);
  }

  public changeMainImage(image: Image): void {
    if (this.hotelId === undefined) {
      return;
    }
    if (this.roomId === undefined) {
      this.changeHotelMainImage(this.hotelId, image);
    } else {
      
      this.changeRoomMainImage(this.hotelId, this.roomId, image);
    }
  }

  private changeHotelMainImage(hotelId: number, image: Image): void {
    if (this.roomId === undefined) {
      this.hotelService
      .changeMainImage(hotelId, image)
      .subscribe(
        () => {
          this.openSnackBar('Main image was successfully changed');
        },
        (serverError: HttpErrorResponse) => {
          this.openSnackBar(serverError.error as string);
        }
      );
    }
  }

  private changeRoomMainImage(hotelId: number, roomId: number, image: Image): void {
    this.roomService
      .changeMainImage(hotelId, roomId, image)
      .subscribe(
        () => {
          this.openSnackBar('Main image was successfully changed');
        },
        (serverError: HttpErrorResponse) => {
          this.openSnackBar(serverError.error as string);
        }
      );
  }

  private deleteHotelImage(hotelId: number, image: Image): void {
    this.imageHotelService
      .deleteImage(hotelId, image)
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
    if (this.roomId === undefined) {
      this.fetchHotelImages(this.hotelId);
    } else {
      this.fetchRoomImages(this.hotelId, this.roomId);
    }
  }

  private fetchHotelImages(hotelId: number): void {
    this.imageHotelService
      .getImages(hotelId)
      .subscribe(images => this.images = images);
  }

  private fetchRoomImages(hotelId: number, roomId: number): void {
    this.imageRoomService
      .getImages(hotelId, roomId)
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
