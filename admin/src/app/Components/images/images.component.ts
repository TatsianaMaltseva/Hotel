import { Component, Input, OnInit } from '@angular/core';

import { ImageService } from 'src/app/image.service';
import { AccountService } from 'src/app/account.service';
import { Image } from 'src/app/Dtos/image';
import { PageParameters } from 'src/app/Core/page-parameters';
import { ImagesResponse } from 'src/app/Core/images-response';
import { PageEvent } from '@angular/material/paginator';

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
  public imageCount: number = 0;
  public pageSize: number = 5;
  public pageIndex: number = 0;

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

  public onPaginationChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.fetchImages();
  }

  private fetchImages(): void {
    if (this.hotelId === undefined) {
      return;
    }
    this.imageService
      .getImages(
        this.hotelId,
        { pageSize: this.pageSize, pageIndex: this.pageIndex } as PageParameters,
        this.roomId
      )
      .subscribe(
        (responce: ImagesResponse) => {
          this.images = responce.images;
          this.imageCount = responce.imageCount;
        }
      );
  }
}
