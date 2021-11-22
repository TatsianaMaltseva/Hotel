import { Component, OnInit } from '@angular/core';
import { Hotel, HotelService } from 'src/app/hotel.service';

@Component({
  selector: 'app-hotel-cards',
  templateUrl: './hotel-cards.component.html',
  styleUrls: ['./hotel-cards.component.css']
})
export class HotelCardsComponent implements OnInit{

  public hotels: Hotel[] = [];

  public constructor(
    private readonly hotelService: HotelService
  ) {
  }

  public ngOnInit(): void {
    this.getHotels();
  }

  private getHotels(): void {
    this.hotelService
    .getHotels()
    .subscribe(hotels => this.hotels = hotels);
  }
}
