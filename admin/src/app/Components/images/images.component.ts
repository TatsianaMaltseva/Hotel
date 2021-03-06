import { Component, Input, OnInit } from '@angular/core';

import { ImageService } from 'src/app/image.service';
import { AccountService } from 'src/app/account.service';
import { Image } from 'src/app/Dtos/image';

@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.css']
})
export class ImagesComponent implements OnInit {
  @Input() public hotelId?: number;
  @Input() public roomId?: number;
  
  public progress: number = 0;
  public images: Image[] = [];

  public get isAdmin(): boolean {
    return this.accountService.isAdmin;
  }
  
  public constructor(
    private readonly imageService: ImageService,
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
    return this.imageService
      .createImagePath(
        this.hotelId, 
        image.id,
        this.roomId
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
}
