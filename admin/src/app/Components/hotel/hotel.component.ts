import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { HotelService } from 'src/app/hotel.service';
import { Hotel } from 'src/app/Dtos/hotel';
import { LoadingService } from 'src/app/loading.service';
import { AccountService } from 'src/app/account.service';

@Component({
  selector: 'app-hotel',
  templateUrl: './hotel.component.html',
  styleUrls: ['./hotel.component.css']
})
export class HotelComponent implements OnInit{
  public hotelId: number = 0;
  public hotel!: Hotel;
  public loading = this.loader.loading;

  public get isAdmin(): boolean {
    return this.accountService.isAdmin();
  }

  public constructor(
    private readonly hotelService: HotelService,
    private readonly route: ActivatedRoute,
    private readonly loader: LoadingService,
    private readonly accountService: AccountService
  ) { 
    this.setHotelId();
  }

  public ngOnInit(): void {
    this.loader.show();
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
        this.loader.hide();
      }
    );
  }
}