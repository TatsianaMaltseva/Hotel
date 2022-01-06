import { Component, Input, OnInit } from '@angular/core';

import { ImageForHotelService } from 'src/app/image-for-hotel.service';
import { AccountService } from 'src/app/account.service';
import { Image } from 'src/app/Dtos/image';
import { ImageForFoomService } from '../image-for-foom.service';

@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.css']
})
export class ImagesComponent implements OnInit {
  public progress: number = 0;
  public images: Image[] = [];
  @Input() public hotelId?: number;
  @Input() public roomId?: number;

  public get isAdmin(): boolean {
    return this.accountService.isAdmin;
  }
  
  public constructor(
    private readonly imageHotelService: ImageForHotelService,
    private readonly imageRoomsService: ImageForFoomService,
    private readonly accountService: AccountService
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
    return this.imageRoomsService
      .createImagePath(
        this.hotelId, 
        this.roomId, 
        image.id
      );
  }

  private fetchImages(): void {
    if (this.hotelId === undefined) {
      return;
    }
    if (this.roomId === undefined) {
      this.imageHotelService
      .getImages(this.hotelId)
      .subscribe(images => this.images = images);
    } else {
      this.imageRoomsService
        .getImages(this.hotelId, this.roomId)
        .subscribe(images => this.images = images);
    }
  }
}
