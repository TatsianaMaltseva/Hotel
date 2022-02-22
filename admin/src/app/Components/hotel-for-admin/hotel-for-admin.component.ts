import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxMaterialTimepickerTheme } from 'ngx-material-timepicker';

import { FacilititesDialogData } from 'src/app/Core/facilities-dialog-data';
import { hotelParamsMaxLenght } from 'src/app/Core/validation-params';
import { Hotel, HotelToAdd, HotelToEdit } from 'src/app/Dtos/hotel';
import { HotelFilterService } from 'src/app/hotel-filter.service';
import { HotelService } from 'src/app/hotel.service';
import { ChooseFacilitiesForAdminComponent } from '../choose-facilities-for-admin/choose-facilities-for-admin.component';

export enum Mode {
  create,
  edit
}

@Component({
  selector: 'app-hotel-for-admin',
  templateUrl: './hotel-for-admin.component.html',
  styleUrls: ['./hotel-for-admin.component.css']
})
export class HotelForAdminComponent implements OnInit {
  public hotelId?: number;
  public hotelForm: FormGroup;
  public loading: boolean = false;
  public isHotelLoaded: boolean = false;
  public hotelMode: Mode = Mode.create;
  public serverErrorResponse: string = '';
  public countries: string[] = [];
  public cities: string[] = [];
  public timePickerStyle: NgxMaterialTimepickerTheme = {
    container: {
      buttonColor: '#37393B'
    },
    dial: {
      dialBackgroundColor: '#B814D8'
    },
    clockFace: {
      clockHandColor: '#B814D8'
    }
  };

  public get hotel(): Hotel {
    return this.hotelForm.value as Hotel;
  }

  public get country(): AbstractControl | null {
    return this.hotelForm.get('country');
  }

  public get city(): AbstractControl | null {
    return this.hotelForm.get('city');
  }

  public get isHotelNew(): boolean {
    return this.hotelMode === Mode.create;
  }

  public constructor(
    private readonly hotelService: HotelService,
    private readonly route: ActivatedRoute,
    private readonly formBuilder: FormBuilder,
    private readonly snackBar: MatSnackBar,
    private readonly matDialog: MatDialog,
    private readonly router: Router,
    private readonly hotelFilterService: HotelFilterService
  ) {
    this.hotelForm = formBuilder.group(
      {
        id: [],
        name: [
          '',
          [
            Validators.required,
            Validators.maxLength(hotelParamsMaxLenght.name)
          ]
        ],
        country: [
          '',
          [
            Validators.required,
            Validators.maxLength(hotelParamsMaxLenght.country)
          ]
        ],
        city: [
          '',
          [
            Validators.required,
            Validators.maxLength(hotelParamsMaxLenght.city)
          ]
        ],
        address: [
          '',
          [
            Validators.required,
            Validators.maxLength(hotelParamsMaxLenght.address)
          ]
        ],
        description: ['', Validators.maxLength(hotelParamsMaxLenght.desciprion)],
        checkInTime: ['', [Validators.required]],
        checkOutTime: ['', [Validators.required]],
        mainImageId: [],
        facilities: []
      }
    );
  }

  public ngOnInit(): void {
    this.country?.valueChanges
      .subscribe(
        (value) => {
          this.fetchCountryAutocompleteValues(value);
        }
      );
    this.city?.valueChanges
      .subscribe(
        (value) => {
          this.fetchCityAutocompleteValues(value);
        }
      );

    if (this.route.routeConfig?.path?.includes('add-new')) {
      this.isHotelLoaded = true;
      return;
    }

    const id: string | null = this.route.snapshot.paramMap.get('id');
    if (!id || !this.isValidId(id)) {
      this.openErrorSnackBar('Hotel id is not valid');
    } else {
      this.loading = true;
      this.hotelId = +id;
      this.fetchHotel(this.hotelId);
    }
  }

  public checkIfHasRequiredError(controlName: string): boolean | undefined {
    return this.hotelForm.get(controlName)?.hasError('required');
  }

  public checkIfHasMaxErrorError(controlName: string): boolean | undefined {
    return this.hotelForm.get(controlName)?.hasError('maxlength');
  }

  public editHotel(): void {
    if (!this.hotelId) {
      return;
    }
    this.hotelService
      .editHotel(this.hotelId, this.hotelForm.value as HotelToEdit)
      .subscribe(
        null,
        (serverError: HttpErrorResponse) => {
          this.serverErrorResponse = serverError.error as string;
        }
      );
  }

  public getMaxLengthValue(controlName: string): number {
    return this.hotelForm.get(controlName)?.errors?.maxlength.requiredLength;
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

  public addHotel(): void {
    this.hotelService
      .addHotel(this.hotelForm.value as HotelToAdd)
      .subscribe(
        (hotelId: number) => {
          this.router.navigate(['hotels', hotelId, 'edit']);
        },
        (serverError: HttpErrorResponse) => {
          this.serverErrorResponse = serverError.error as string;
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
          this.hotelForm.patchValue(hotel);
          this.hotelMode = Mode.edit;
          this.isHotelLoaded = true;
        }
      )
      .add(
        () => {
          this.loading = false;
        }
      );
  }

  private fetchCountryAutocompleteValues(filterValue: string): void {
    this.hotelFilterService
      .getHotelCountries(filterValue)
      .subscribe(countries => this.countries = countries);
  }

  private fetchCityAutocompleteValues(filterValue: string): void {
    this.hotelFilterService
      .getHotelCities(filterValue)
      .subscribe(cities => this.cities = cities);
  }
}
