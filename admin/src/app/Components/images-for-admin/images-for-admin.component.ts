import { Component, Input, OnInit } from '@angular/core';

import { ImageService } from 'src/app/image.service';
import { Image } from 'src/app/Dtos/image';

@Component({
  selector: 'app-images-for-admin',
  templateUrl: './images-for-admin.component.html',
  styleUrls: ['./images-for-admin.component.css']
})
export class ImagesForAdminComponent implements OnInit {
  public progress: number = 0;
  public images: Image[] = [];
  @Input() public hotelId: number = 0;

  public constructor(
    private readonly imageService: ImageService
  ) { 
  }

  public ngOnInit(): void {
    this.fetchImages();
  }
  
  public createImgPath(image: Image): string {
    return this.imageService.createImgPath(this.hotelId, image);
  }

  public fetchImages(): void {
    this.imageService
      .getImages(this.hotelId)
      .subscribe(images => this.images = images);
  }

  public onImageUpload(imageId: number): void {
    this.images.push({ id: imageId } as Image);
  }
}
