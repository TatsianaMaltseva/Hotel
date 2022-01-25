import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Params, Router } from '@angular/router';
import * as dayjs from 'dayjs';

import { hotelParamsMaxLenght } from 'src/app/Core/validation-params';
import { HotelFilterService } from 'src/app/hotel-filter.service';
import { DateService } from '../../date.service';

@Component({
  selector: 'app-hotels-filter',
  templateUrl: './hotels-filter.component.html'
})
export class HotelsFilterComponent implements OnInit {
  public names: string[] = [];
  public filterForm: FormGroup;
  public dateForm: FormGroup;
  public today = new Date();

  public get name(): AbstractControl | null {
    return this.filterForm.get('name');
  }

  public constructor(
    private readonly hotelFilterService: HotelFilterService,
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly dateService: DateService
  ) {
    this.filterForm = formBuilder.group(
      {
        name: ['', Validators.maxLength(hotelParamsMaxLenght.name)]
      }
    );

    this.dateForm = formBuilder.group(
      {
        checkInDate: ['', [Validators.required]],
        checkOutDate: ['', [Validators.required]]
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

  public updateUrl(): void {
    const format = 'YYYY-MM-DD';
    const checkInValue = this.dateForm.get('checkInDate')?.value;
    const checkOutValue = this.dateForm.get('checkOutDate')?.value;
    const checkInDate = dayjs(new Date(checkInValue)).format(format);
    const checkOutDate = dayjs(new Date(checkOutValue)).format(format);

    this.hotelFilterService.updateParameters( 
      //checkInDate, checkOutDate, 
      this.filterForm.value);

    this.dateService.updateDateParams(checkInDate, checkOutDate);
    const params =  { checkInDate, checkOutDate, ...this.hotelFilterService.filterParameters } as Params;
    
    void this.router.navigate(
      [],
      {
        queryParams: params,
        queryParamsHandling: 'merge'
      }
    );
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
