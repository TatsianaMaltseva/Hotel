import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  public today = new Date();

  public get name(): AbstractControl | null {
    return this.filterForm.get('name');
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
            this.fetchAutocompleteValues(value);
        }
      );
  }

  public updateFilterParameters(): void {
    this.hotelFilterService.updateParameters(this.filterForm.value);
    this.filterParametersUpdated.emit();
  }

  public fetchAutocompleteValues(value: string): void {
    const filterValue: string = value;
    this.hotelFilterService
      .getHotelNames(filterValue)
      .subscribe(names => this.names = names);
  }

  private isEmpty(obj: object): boolean {
    return Object.values(obj).every(x => x === '');
  }
}
