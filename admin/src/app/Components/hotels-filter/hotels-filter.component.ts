import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Params, Router } from '@angular/router';

import { hotelParamsMaxLenght } from 'src/app/Core/hotelValidationParams';
import { HotelFilterService } from 'src/app/hotel-filter.service';

@Component({
  selector: 'app-hotels-filter',
  templateUrl: './hotels-filter.component.html'
})
export class HotelsFilterComponent implements OnInit {
  public names: string[] = [];
  public filterForm: FormGroup;

  public get name(): AbstractControl | null {
    return this.filterForm.get('name');
  }

  public constructor(
    private readonly hotelFilterService: HotelFilterService,
    private readonly formBuilder: FormBuilder,
    private readonly router: Router
  ) {
    this.filterForm = formBuilder.group(
      {
        name: ['', Validators.maxLength(hotelParamsMaxLenght.name)]
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
    this.hotelFilterService.updateParameters(this.filterForm.value);
    const params = this.hotelFilterService.filterParameters as Params;
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
