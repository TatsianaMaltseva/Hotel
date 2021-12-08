import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { PageParameters } from 'src/app/Core/pageParameters';
import { HotelService } from 'src/app/hotel.service';
import { HotelCard } from 'src/app/HotelDtos/hotelCard';

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
    private readonly hotelService: HotelService
  ) {
  }

  public ngOnInit(): void {
    this.fetchHotels();
    this.fetchHotelsCount();
  }

  public onPaginateChange(event?: PageEvent): void {
    this.pageParameters.updateParameters(event);
    this.fetchHotels();
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