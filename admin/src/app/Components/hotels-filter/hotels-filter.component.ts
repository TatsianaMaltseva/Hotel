import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { delay } from 'rxjs/operators';

import { AccountService } from 'src/app/account.service';
import { hotelParamsMaxLenght } from 'src/app/Core/validation-params';
import { HotelFilterService } from 'src/app/hotel-filter.service';

@Component({
  selector: 'app-hotels-filter',
  templateUrl: './hotels-filter.component.html'
})
export class HotelsFilterComponent implements OnInit {
  @Output() public filterParametersUpdated = new EventEmitter<void>();

  public filterForm: FormGroup;
  public names: string[] = [];
  public countries: string[] = [];
  public cities: string[] = [];
  public today = new Date();

  public get name(): AbstractControl | null {
    return this.filterForm.get('name');
  }

  public get country(): AbstractControl | null {
    return this.filterForm.get('country');
  }

  public get city(): AbstractControl | null {
    return this.filterForm.get('city');
  }

  public get isAdmin(): boolean {
    return this.accountService.isAdmin;
  }

  public constructor(
    private readonly hotelFilterService: HotelFilterService,
    private readonly formBuilder: FormBuilder,
    private readonly accountService: AccountService
  ) {
    this.filterForm = formBuilder.group(
      {
        name: [
          this.hotelFilterService.name,
          [Validators.maxLength(hotelParamsMaxLenght.name)]
        ],
        country: [
          this.hotelFilterService.country,
          [Validators.maxLength(hotelParamsMaxLenght.country)]
        ],
        city: [
          this.hotelFilterService.city,
          [Validators.maxLength(hotelParamsMaxLenght.city)]
        ],
        checkInDate: [this.hotelFilterService.checkInDate],
        checkOutDate: [this.hotelFilterService.checkOutDate]
      }
    );
  }

  public ngOnInit(): void {
    if (!this.isEmpty(this.hotelFilterService.filterParameters)) {
      this.filterForm.patchValue(this.hotelFilterService.filterParameters);
    }
    this.name?.valueChanges
      .subscribe(
        (value) => {
            this.fetchNameAutocompleteValues(value);
        }
      );
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
  }

  public updateFilterParameters(): void {
    this.hotelFilterService.updateParameters(this.filterForm.value);
    this.filterParametersUpdated.emit();
  }

  private fetchNameAutocompleteValues(filterValue: string): void {
    this.hotelFilterService
      .getHotelNames(filterValue)
      .subscribe(names => this.names = names);
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

  private isEmpty(obj: object): boolean {
    return Object.values(obj).every(x => x === '');
  }
}
