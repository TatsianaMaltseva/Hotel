import { Component } from '@angular/core';
import { HttpEventType } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

import { environment } from 'src/environments/environment';
import { ImageService, Image } from 'src/app/image.service';
import { AccountService } from 'src/app/account.service';

@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.css']
})
export class ImagesComponent{
  public progress: number = 0;
  public images: Image[] = [];
  private hotelId: number = 0;
  private readonly apiUrl: string;

  public get isAdmin(): boolean {
    return this.accountService.isAdmin();
  }
  
  public constructor(
    private readonly route: ActivatedRoute,
    private readonly imageService: ImageService,
    private readonly accountService: AccountService
  ) {
    this.apiUrl = environment.api;
    this.route.params
      .subscribe(params => this.hotelId = params.id);
      this.fetchImages();
  }

  public createImgPath = (image: Image): string => {
    return `${this.apiUrl}${image.path}`;
  };

  public uploadFile = (files: FileList | null): void => {
    if (files?.length === 0) return;
    this.imageService.postImage(files, this.hotelId)
    .subscribe(event => {
      this.fetchImages();
      if (event.type === HttpEventType.UploadProgress){
        this.progress = Math.round(100 * event.loaded / event.total ); 
      }
    });
  };

  public fetchImages(): void {
    this.imageService
    .getImages(this.hotelId)
    .subscribe(images => this.images = images);
  }
}
