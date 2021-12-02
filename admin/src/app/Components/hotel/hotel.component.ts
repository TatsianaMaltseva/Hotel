import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccountService } from 'src/app/account.service';
import { Hotel, HotelService } from 'src/app/hotel.service';

@Component({
  selector: 'app-hotel',
  templateUrl: './hotel.component.html',
  styleUrls: ['./hotel.component.css']
})
export class HotelComponent implements OnInit{
  public hotelId: number = 0;
  public hotel: Hotel = {
    id: 0,
    name: '',
    country: '',
    city: '',
    address: '',
    description: null,
    mainImage: null,
    images:  null
  };
  // back откидывает на первую страничку в пагинации

  public constructor(
    private readonly hotelService: HotelService,
    private readonly accountService: AccountService,
    private readonly route: ActivatedRoute
  ) { 
    this.route.params
    .subscribe(params => this.hotelId = params['id']);
  }

  public ngOnInit(): void {
    this.fetchHotel(this.hotelId);
  }

  private fetchHotel(id: number): void {
    this.hotelService
      .getHotel(this.hotelId)
      .subscribe(hotel => this.hotel = hotel);
  }

  public isAdmin(): boolean {
    return this.accountService.isAdmin();
  }

  public isClient(): boolean {
    return this.accountService.isClient();
  }

}
