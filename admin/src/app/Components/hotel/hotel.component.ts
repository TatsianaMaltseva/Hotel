import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { HotelService } from 'src/app/hotel.service';
import { Hotel } from 'src/app/Dtos/hotel';

@Component({
  selector: 'app-hotel',
  templateUrl: './hotel.component.html',
  styleUrls: ['./hotel.component.css']
})
export class HotelComponent implements OnInit{
  public hotelId: number = 0;
  public hotel!: Hotel;
  public isHotelLoaded: Promise<boolean> = Promise.resolve(false);

  public constructor(
    private readonly hotelService: HotelService,
    private readonly route: ActivatedRoute
  ) { 
    this.setHotelId();
  }

  public ngOnInit(): void {
    this.fetchHotel();
  }

  private setHotelId(): void {
    this.route.params.subscribe(params => this.hotelId = params['id']);
  }

  private fetchHotel(): void {
    this.hotelService
      .getHotel(this.hotelId)
      .subscribe(hotel => {
        this.hotel = hotel;
        this.isHotelLoaded = Promise.resolve(true);
      }
    );
  }
}