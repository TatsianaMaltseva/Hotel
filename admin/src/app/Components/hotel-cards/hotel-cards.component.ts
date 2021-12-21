import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';

import { PageParameters } from 'src/app/Core/pageParameters';
import { HotelService } from 'src/app/hotel.service';
import { HotelCard } from 'src/app/Dtos/hotelCard';
import { AccountService } from 'src/app/account.service';
import { Hotel } from 'src/app/Dtos/hotel';

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
    private readonly accountService: AccountService
  ) {
  }

  public ngOnInit(): void {
    this.setPageParams();
    this.navigate();
    this.fetchHotelsCount();
    this.fetchHotels();
  }

  public setRouterLink(hotel: HotelCard): string {
    if (this.accountService.isAdmin()){
      return `/admin-hotels/${hotel.id}`;
    }
    return `/hotels/${hotel.id}`;
  }
  public navigate(): void {
    void this.router.navigate(
      [],
      { queryParams: this.pageParameters.getQueryParams() }
    );
  }

  public onPaginateChange(event: PageEvent): void {
    this.pageParameters.updateParameters(event);
    this.navigate();
    this.fetchHotels();
  }

  private setPageParams(): void {
    this.route.queryParams
      .subscribe(params => {
        if (params.pageIndex !== undefined) {
          this.pageParameters.updateParameters(params);
        }
      }
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