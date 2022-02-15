import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

import { AccountService } from 'src/app/account.service';
import { hotelParamsMaxLenght } from 'src/app/Core/validation-params';
import { HotelFilterService } from 'src/app/hotel-filter.service';

@Component({
  selector: 'app-hotels-filter',
  templateUrl: './hotels-filter.component.html',
  styleUrls: ['./hotels-filter.component.css']
})
export class HotelsFilterComponent implements OnInit {
  @Output() public filterParametersUpdated = new EventEmitter<void>();

  public filterForm: FormGroup;
  public names: string[] = [];
  public countries: string[] = [];
  public cities: string[] = [];
  public today = new Date();
  private readonly autocompleteDelay = 300;

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
          this.hotelFilterService.params.name,
          [Validators.maxLength(hotelParamsMaxLenght.name)]
        ],
        country: [
          this.hotelFilterService.params.country,
          [Validators.maxLength(hotelParamsMaxLenght.country)]
        ],
        city: [
          this.hotelFilterService.params.city,
          [Validators.maxLength(hotelParamsMaxLenght.city)]
        ],
        sleeps: [
          this.hotelFilterService.params.sleeps
        ],
        checkInDate: [this.hotelFilterService.params.checkInDate],
        checkOutDate: [this.hotelFilterService.params.checkOutDate]
      }
    );
  }

  public ngOnInit(): void {
    if (!this.isEmpty(this.hotelFilterService.params)) {
      this.filterForm.patchValue(this.hotelFilterService.params);
    }
    this.name?.valueChanges
      .pipe(debounceTime(this.autocompleteDelay))
      .subscribe(
        (value: string) => {
          this.fetchNameAutocompleteValues(value);
          }
      );

    this.country?.valueChanges
      .pipe(debounceTime(this.autocompleteDelay))
      .subscribe(
        (value) => {
          this.fetchCountryAutocompleteValues(value);
        }
      );
    this.city?.valueChanges
      .pipe(debounceTime(this.autocompleteDelay))
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
