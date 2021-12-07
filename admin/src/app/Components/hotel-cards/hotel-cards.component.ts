import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Location } from '@angular/common'; 

import { PageParameters } from 'src/app/Core/pageParameters';
import { HotelDto, HotelService } from 'src/app/hotel.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hotel-cards',
  templateUrl: './hotel-cards.component.html',
  styleUrls: ['./hotel-cards.component.css']
})

export class HotelCardsComponent implements OnInit {
  public hotels: HotelDto[] = [];
  public hotelCount: number = 0;
  public pageParameters = new PageParameters(2);

  public constructor(
    private readonly hotelService: HotelService,
    private readonly location: Location,
    private readonly router: Router
  ) {
  }

  //change page params 
  public ngOnInit(): void {
    this.updateQuery();
    this.fetchHotels();
    this.fetchHotelsCount();
  }

  public openHotel(hotel: HotelDto): void {
    this.router.navigate(
      ['/hotels', hotel.id],
      { queryParams: this.pageParameters.getHttpParamsObj() }
    );
  }

  public onPaginateChange(event?: PageEvent): void {
    this.pageParameters.pageIndex = event!.pageIndex;
    this.pageParameters.pageSize = event!.pageSize;
    this.updateQuery();
    this.fetchHotels();
  }

  public updateQuery(): void {
    this.location.replaceState(
      '/hotels',
      this.pageParameters.getHttpParams().toString()
    );
  }

  private fetchHotelsCount(): void {
    this.hotelService
      .getHotelsCount()
      .subscribe(number => this.hotelCount = number);
  }

  private fetchHotels(): void {
    this.hotelService
      .getHotels(this.pageParameters)
      .subscribe(hotels => this.hotels = hotels);
  }
}