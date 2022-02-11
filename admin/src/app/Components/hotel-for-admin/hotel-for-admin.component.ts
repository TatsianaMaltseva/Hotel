import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';

import { FacilititesDialogData } from 'src/app/Core/facilities-dialog-data';
import { hotelParamsMaxLenght } from 'src/app/Core/validation-params';
import { Hotel, HotelToEdit } from 'src/app/Dtos/hotel';
import { HotelService } from 'src/app/hotel.service';
import { ChooseFacilitiesForAdminComponent } from '../choose-facilities-for-admin/choose-facilities-for-admin.component';

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

  public get hotel(): Hotel {
    return this.changeHotelForm.value as Hotel;
  }

  public constructor(
    private readonly hotelService: HotelService,
    private readonly route: ActivatedRoute,
    private readonly formBuilder: FormBuilder,
    private readonly snackBar: MatSnackBar,
    private readonly matDialog: MatDialog
  ) {
    this.changeHotelForm = formBuilder.group(
      {
        id: [''],
        name: ['', Validators.maxLength(hotelParamsMaxLenght.name)],
        country: ['', Validators.maxLength(hotelParamsMaxLenght.country)],
        city: ['', Validators.maxLength(hotelParamsMaxLenght.city)],
        address: ['', Validators.maxLength(hotelParamsMaxLenght.address)],
        description: ['', Validators.maxLength(hotelParamsMaxLenght.desciprion)],
        mainImageId: [],
        facilities: []
      }
    );
  }

  public ngOnInit(): void {
    const id: string | null = this.route.snapshot.paramMap.get('id');
    if (!id || !this.isValidId(id)) {
      this.openErrorSnackBar('Hotel id is not valid');
    } else {
      this.loading = true;
      this.hotelId = +id;
      this.fetchHotel(this.hotelId);
    }
  }

  public editHotel(): void {
    if (!this.hotelId) {
      return;
    }
    this.hotelService
      .editHotel(this.hotelId, this.changeHotelForm.value as HotelToEdit)
      .subscribe();
  }

  public getMaxLengthValue(controlName: string): number {
    return this.changeHotelForm.get(controlName)?.errors?.maxlength.requiredLength;
  }

  public openFacilitiesDialog(): void {
    this.matDialog.open(
      ChooseFacilitiesForAdminComponent,
      {
        width: '600px',
        data: { hotel: this.hotel, facilities: this.hotel.facilities } as FacilititesDialogData
      }
    );
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