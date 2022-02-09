import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';

import { HotelService } from 'src/app/hotel.service';
import { HotelCard } from 'src/app/Dtos/hotelCard';
import { ImageService } from 'src/app/image.service';
import { HotelCardResponse } from 'src/app/Core/hotel-card-response';
import { HotelFilterService } from 'src/app/hotel-filter.service';
import { PageParametersService } from 'src/app/page-parameters.service';

@Component({
  selector: 'app-hotel-cards',
  templateUrl: './hotel-cards.component.html',
  styleUrls: ['./hotel-cards.component.css']
})

export class HotelCardsComponent implements OnInit {
  public hotels: HotelCard[] = [];
  public hotelCount: number = 0;
  public pageSize: number;
  public pageIndex: number;

  public constructor(
    private readonly hotelService: HotelService,
    private readonly imageService: ImageService,
    private readonly hotelFilterService: HotelFilterService,
    private readonly pageParametersService: PageParametersService
  ) {
    this.pageSize = this.pageParametersService.pageSize;
    this.pageIndex = this.pageParametersService.pageIndex;
  }

  public ngOnInit(): void {
    this.fetchHotels();
  }

  public onPaginationChange(event: PageEvent): void {
    this.pageParametersService.updateParameters(event);
    this.fetchHotels();
  }

  public fetchHotels(): void {
    this.hotelService
      .getHotelCards(this.pageParametersService.pageParameters, this.hotelFilterService.filterParameters)
      .subscribe(
        (response: HotelCardResponse) => {
            this.hotelCount = response.hotelCount;
            this.hotels = response.hotelCards;
          }
      );
  }

  public createImagePath(hotelId: number, image: number): string {
    return this.imageService.createImagePath(hotelId, image );
  }
}