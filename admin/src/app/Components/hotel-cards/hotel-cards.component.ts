import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router';

import { PageParameters } from 'src/app/Core/pageParameters';
import { HotelService } from 'src/app/hotel.service';
import { HotelCard } from 'src/app/Dtos/hotelCard';
import { HotelFilterService } from 'src/app/hotel-filter.service';
import { HotelCardResponse } from 'src/app/Core/hotel-card-response';

@Component({
  selector: 'app-hotel-cards',
  templateUrl: './hotel-cards.component.html',
  styleUrls: ['./hotel-cards.component.css']
})

export class HotelCardsComponent implements OnInit {
  public hotels: HotelCard[] = [];
  public hotelCount: number = 0;
  public readonly pageParameters = new PageParameters(2);

  public constructor(
    private readonly hotelService: HotelService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly hotelFilterService: HotelFilterService
  ) {
  }

  public ngOnInit(): void {
    this.setPageParams();
    this.updateUrl();
    this.fetchHotels();
    this.router.events
      .subscribe(
        (event) => {
          if (event instanceof NavigationEnd) {
            this.setFilterParams();
            this.fetchHotels();
          }
        } 
      );
  }

  public updateUrl(): void {
    const params = { ...this.pageParameters, ...this.hotelFilterService.filterParameters } as Params;
    void this.router.navigate(
      [],
      { queryParams: params }
    );
  }

  public onPaginationChange(event: PageEvent): void {
    this.pageParameters.updateParameters(event);
    this.updateUrl();
    this.fetchHotels();
  }

  public fetchHotels(): void {
    this.hotelService
      .getHotelCards(this.pageParameters, this.hotelFilterService.filterParameters)
      .subscribe(
        (response: HotelCardResponse) => {
            this.hotelCount = response.hotelCount;
            this.hotels = response.hotelCards;
          }
        );
  }

  private setPageParams(): void {
    this.route.queryParams
      .subscribe(
        (params) => {
          if (params.pageIndex !== undefined) {
            this.pageParameters.updateParameters(params);
          }
        }
      );
  }

  private setFilterParams(): void {
    this.route.queryParams
      .subscribe(
        (params) => {
          if (params.name !== undefined) {
            this.hotelFilterService.updateParameters(params);
          }
        }
      );
  }
}