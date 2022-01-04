import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { hotelParamsMaxLenght } from 'src/app/Core/hotelValidationParams';
import { FilterService } from 'src/app/filterService';

@Component({
  selector: 'app-hotels-filter',
  templateUrl: './hotels-filter.component.html'
})
export class HotelsFilterComponent implements OnInit {
  public names: string[] = [];
  public countries: string[] = [];
  public cities: string[] = [];
  public filterForm: FormGroup;

  public get name(): AbstractControl | null {
    return this.filterForm.get('name');
  }

  public get country(): AbstractControl | null {
    return this.filterForm.get('county');
  }

  public get city(): AbstractControl | null {
    return this.filterForm.get('city');
  }

  public constructor(
    private readonly filterService: FilterService,
    private readonly formBuilder: FormBuilder,
    private readonly router: Router
  ) {
    this.filterForm = this.formBuilder.group(
      {
        name: ['', Validators.maxLength(hotelParamsMaxLenght.name)],
        country: ['', Validators.maxLength(hotelParamsMaxLenght.country)],
        city: ['', Validators.maxLength(hotelParamsMaxLenght.city)]
      }
    );
  }

  public ngOnInit(): void {
    this.name?.valueChanges.subscribe((value) => this.filter(value));
  }

  public updateUrl(): void {
    const params = {
      'name': this.name?.value
    };
    void this.router.navigate(
      [],
      { queryParams: params }
    );
  }

  public filter(value: string): void {
    const filterValue: string = value;
    this.filterService.getHotelNames(filterValue)
      .subscribe(names => this.names = names);
  }
}
//filter component should also have pageParams, it is wrong; I should add new params to those that already exists