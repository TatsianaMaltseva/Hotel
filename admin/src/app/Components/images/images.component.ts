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
    private readonly imageRoomService: ImageForFoomService,
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
    return this.imageRoomService
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
}
