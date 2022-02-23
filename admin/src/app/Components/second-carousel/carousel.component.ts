import { Component, OnInit } from '@angular/core';

import { HotelCard } from 'src/app/Dtos/hotelCard';
import { HotelService } from 'src/app/hotel.service';
import { PageParameters } from 'src/app/Core/page-parameters';
import { HotelCardResponse } from 'src/app/Core/hotel-card-response';
import { ImageService } from 'src/app/image.service';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements OnInit {
  public cards: HotelCard[] = [];
  public areCardsLoaded = false;

  public constructor(
    private readonly hotelService: HotelService,
    private readonly imageService: ImageService
  ) {
  }

  public ngOnInit(): void {
    const pageParameters: PageParameters = {
      pageSize: 5,
      pageIndex: 0
    };
    this.hotelService
      .getHotelCards(pageParameters, {})
      .subscribe(
        (response: HotelCardResponse) => {
          this.cards = response.hotelCards;
          this.areCardsLoaded = true;
        }
      );
  }

  public createImagePath(hotelId: number, image: number): string {
    return this.imageService.createImagePath(hotelId, image );
  }

}
