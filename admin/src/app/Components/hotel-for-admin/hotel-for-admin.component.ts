import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';

import { hotelParamsMaxLenght } from 'src/app/Core/validation-params';
import { Hotel } from 'src/app/Dtos/hotel';
import { HotelService } from 'src/app/hotel.service';

@Component({
  selector: 'app-hotel-for-admin',
  templateUrl: './hotel-for-admin.component.html',
  styleUrls: ['./hotel-for-admin.component.css']
})
export class HotelForAdminComponent implements OnInit {
  public hotelId?: number;
  public changeHotelForm: FormGroup;
  public loading = false;
  public isHotelLoaded = false;

  public constructor(
    private readonly hotelService: HotelService,
    private readonly route: ActivatedRoute,
    private readonly formBuilder: FormBuilder,
    private readonly snackBar: MatSnackBar
  ) {
    this.changeHotelForm = formBuilder.group(
      {
        name: ['', Validators.maxLength(hotelParamsMaxLenght.name)],
        country: ['', Validators.maxLength(hotelParamsMaxLenght.country)],
        city: ['', Validators.maxLength(hotelParamsMaxLenght.city)],
        address: ['', Validators.maxLength(hotelParamsMaxLenght.address)],
        description: ['', Validators.maxLength(hotelParamsMaxLenght.desciprion)]
      }
    );
  }

  public ngOnInit(): void {
    const id: string | null = this.route.snapshot.paramMap.get('id');
    if (id === null || !this.isValidId(id)) {
      this.openErrorSnackBar('Hotel id is not valid');
    } else {
      this.loading = true;
      this.hotelId = +id;
      this.fetchHotel(this.hotelId);
    }
  }

  public editHotel(): void {
    if (this.hotelId === undefined) {
      return;
    }
    this.hotelService
      .editHotel(this.hotelId, this.changeHotelForm.value as Hotel)
      .subscribe();
  }

  public getMaxLengthValue(controlName: string): number {
    return this.changeHotelForm.get(controlName)?.errors?.maxlength.requiredLength;
  }

  private openErrorSnackBar(errorMessage: string): void {
    this.snackBar.open(
      `${errorMessage}`,
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
          this.changeHotelForm.patchValue(hotel);
          this.isHotelLoaded = true;
        },
        (serverError: HttpErrorResponse) => {
          this.openErrorSnackBar(serverError.error as string);
        }
      )
      .add(
        () => {
          this.loading = false;
        }
      );
  }
}