import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ImageService } from 'src/app/image.service';
import { Image } from 'src/app/Dtos/image';
import { HotelService } from 'src/app/hotel.service';
import { RoomService } from '../../room.service';
import { Room } from 'src/app/Dtos/room';
import { Hotel } from 'src/app/Dtos/hotel';
import { PageEvent } from '@angular/material/paginator';
import { PageParameters } from 'src/app/Core/page-parameters';
import { ImagesResponce } from 'src/app/Core/images-response';

@Component({
  selector: 'app-images-for-admin',
  templateUrl: './images-for-admin.component.html',
  styleUrls: ['./images-for-admin.component.css']
})
export class ImagesForAdminComponent implements OnInit {
  @Input() public hotel?: Hotel;
  @Input() public room?: Room;

  public progress: number = 0;
  public images: Image[] = [];
  public imageCount: number = 0;
  public pageSize: number = 5;
  public pageIndex: number = 0;

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
    if (!this.hotel) {
      return '';
    }
    return this.imageService
      .createImagePath(
        this.hotel.id,
        image.id,
        this.room?.id
      );
  }

  public addImage(imageId: number): void {
    this.images.push({ id: imageId } as Image);
    this.imageCount += 1;
  }

  public changeMainImage(image: Image): void {
    if (!this.hotel) {
      return;
    }
    let changeMain$: Observable<string>;
    if (this.room) {
      this.room.mainImageId = image.id;
      changeMain$ = this.roomService.editRoom(this.hotel.id, this.room.id, this.room);
    } else {
      this.hotel.mainImageId = image.id;
      changeMain$ = this.hotelService.editHotel(this.hotel.id, this.hotel);
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
    if (!this.hotel) {
      return;
    }
    this.imageService
      .deleteImage(this.hotel.id, image.id, this.room?.id)
      .subscribe(
        () => {
          if (this.room?.mainImageId === image.id) {
            this.room.mainImageId = undefined;
          }
          this.images = this.images.filter(img => img.id !== image.id);
          this.imageCount -= 1;
          this.openSnackBar('Image was successfully deleted');
        }
    );
  }


  public onPaginationChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.fetchImages();
  }

  private fetchImages(): void {
    if (!this.hotel) {
      return;
    }
    this.imageService
      .getImages(
        this.hotel.id,
        { pageSize: this.pageSize, pageIndex: this.pageIndex } as PageParameters,
        this.room?.id
      )
      .subscribe(
        (responce: ImagesResponce) => {
          this.images = responce.images;
          this.imageCount = responce.imageCount;
        }
      );
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
