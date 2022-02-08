import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';

import { HotelService } from 'src/app/hotel.service';
import { Hotel } from 'src/app/Dtos/hotel';
import { AccountService } from 'src/app/account.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-hotel',
  templateUrl: './hotel.component.html',
  styleUrls: ['./hotel.component.css']
})
export class HotelComponent implements OnInit{
  public hotelId?: number;
  public hotel!: Hotel;
  public loading = false;
  public isHotelLoaded = false;

  public get isAdmin(): boolean {
    return this.accountService.isAdmin;
  }

  public constructor(
    private readonly hotelService: HotelService,
    private readonly route: ActivatedRoute,
    private readonly accountService: AccountService,
    private readonly snackBar: MatSnackBar,
    private readonly location: Location
  ) {
  }

  public ngOnInit(): void {
    const id: string | null = this.route.snapshot.paramMap.get('id');
    if (id === null || !this.isValidId(id)) {
      this.openSnackBar('Hotel id is not valid');
    } else {
      this.loading = true;
      this.hotelId = +id;
      this.fetchHotel(this.hotelId);
    }
  }

  public deleteHotel(): void {
    this.hotelService
      .deleteHotel(this.hotel.id)
      .subscribe(
        () => {
          this.location.back();
        }
      );
  }

  private openSnackBar(message: string): void {
    this.snackBar.open(
      `${message}`,
      'Close',
      {
        duration: 15000
      }
    );
  }

  private isValidId(id: string): boolean {
    return !isNaN(+id);
  }

  private fetchHotel(hotelId: number): void {
    this.hotelService
      .getHotel(hotelId)
      .subscribe(
        (hotel) => {
          this.hotel = hotel;
          this.isHotelLoaded = true;
        }
      )
      .add(
        () => {
          this.loading = false;
        }
      );
  }
}