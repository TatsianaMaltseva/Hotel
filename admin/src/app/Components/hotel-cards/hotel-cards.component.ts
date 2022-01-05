import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router';

import { PageParameters } from 'src/app/Core/pageParameters';
import { HotelService } from 'src/app/hotel.service';
import { HotelCard } from 'src/app/Dtos/hotelCard';
import { FilterService } from 'src/app/filterService';
import { Image } from 'src/app/Dtos/image';
import { Hotel } from 'src/app/Dtos/hotel';
import { ImageService } from 'src/app/image.service';

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
    private readonly filterService: FilterService,
    private readonly imageService: ImageService
  ) {
  }

  public ngOnInit(): void {
    this.setPageParams();
    this.updateUrl();
    this.fetchHotelsCount();
    this.fetchHotels();
    this.router.events
      .subscribe(
        (event) => {
          if (event instanceof NavigationEnd) {
            this.setFilterParams();
            this.fetchHotelsCount();
            this.fetchHotels();
          }
        } 
      );
  }

  public updateUrl(): void {
    const params = Object.assign(this.pageParameters, this.filterService.filterParameters) as Params;
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
      .getHotelCards(this.pageParameters, this.filterService.filterParameters)
      .subscribe(hotels => this.hotels = hotels);
  }

  public createImagePath(hotelId: number, image: number): string {
    return this.imageService.createImagePath(hotelId, image );
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
            this.filterService.updateParameters(params);
          }
        }
      );
  }

  private fetchHotelsCount(): void {
    this.hotelService
      .getHotelsCount(this.filterService.filterParameters)
      .subscribe(number => this.hotelCount = number);
  }
}