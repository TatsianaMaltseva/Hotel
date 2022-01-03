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
  public progress: number = 0;
  public images: Image[] = [];
  @Input() public hotelId: number = 0;

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

  public createImgPath(image: Image): string {
    return this.imageService.createImagePath(this.hotelId, image);
  }

  public fetchImages(): void {
    this.imageService
      .getImages(this.hotelId)
      .subscribe(images => this.images = images);
  }
}
