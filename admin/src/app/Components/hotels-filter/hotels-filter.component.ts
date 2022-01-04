import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Params, Router } from '@angular/router';

import { hotelParamsMaxLenght } from 'src/app/Core/hotelValidationParams';
import { FilterService } from 'src/app/filterService';

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
    private readonly filterService: FilterService,
    private readonly formBuilder: FormBuilder,
    private readonly router: Router
  ) {
    this.filterForm = this.formBuilder.group(
      {
        name: ['', Validators.maxLength(hotelParamsMaxLenght.name)]
      }
    );
  }

  public ngOnInit(): void {
    if (!this.isEmpty(this.filterService.filterParameters)) {
      this.filterForm.patchValue(this.filterService.filterParameters);
    }
    this.name?.valueChanges.subscribe((value) => this.filter(value));
  }

  public updateUrl(): void {
    this.filterService.updateParameters(this.filterForm.value);
    const params = this.filterService.filterParameters as Params;
    void this.router.navigate(
      [],
      {
        queryParams: params,
        queryParamsHandling: 'merge'
      }
    );
  }

  public filter(value: string): void {
    const filterValue: string = value;
    this.filterService
      .getHotelNames(filterValue)
      .subscribe(names => this.names = names);
  }

  private isEmpty(obj: object): boolean {
    return Object.values(obj).every(x => x === '');
  }
}
