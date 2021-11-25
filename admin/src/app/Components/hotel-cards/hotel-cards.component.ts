import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Hotel, HotelService } from 'src/app/hotel.service';

@Component({
  selector: 'app-hotel-cards',
  templateUrl: './hotel-cards.component.html',
  styleUrls: ['./hotel-cards.component.css']
})

export class HotelCardsComponent implements OnInit{
  public hotels: Hotel[] = [];
  public hotelCount: number = 0;
  public readonly startPageSize: number = 2;
  public readonly startPageIndex: number = 1;

  public constructor(
    private readonly hotelService: HotelService
  ) {
  }

  public ngOnInit(): void {
    this.getHotels(this.startPageIndex, this.startPageSize);
    this.getHotelCount();
  }

  public getHotelCount(): void {
    this.hotelService
      .getHotelsCount()
      .subscribe(number => this.hotelCount = number);
  }

  public onPaginateChange(event?: PageEvent): void{
    this.getHotels(event!.pageIndex + 1, event!.pageSize);
  }

  private getHotels(pageIndex: number, pageSize: number): void {
    this.hotelService
      .getHotels(pageIndex, pageSize)
      .subscribe(hotels => this.hotels = hotels);
  }
}