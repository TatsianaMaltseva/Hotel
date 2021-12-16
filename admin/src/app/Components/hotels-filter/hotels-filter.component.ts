import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import { hotelParamsMaxLenght } from 'src/app/Core/hotelValidationParams';
import { FilterService } from 'src/app/filterService';

@Component({
  selector: 'app-hotels-filter',
  templateUrl: './hotels-filter.component.html'
})
export class HotelsFilterComponent implements OnInit {
  public hotelNames: string[] = [];
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
    private readonly formBuilder: FormBuilder
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
    this.fetchNames();
    this.name?.valueChanges.pipe(
      startWith(''),
      map(value => this.filter(value))
    );
  }

  public fetchNames(): void {
    this.filterService.getHotelNames()
      .subscribe(hotelNames => this.hotelNames = hotelNames);
  }

  private filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.hotelNames.filter(hotelName => 
      hotelName.toLowerCase().includes(filterValue));
  }
}