import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { Observable } from 'rxjs';
import * as dayjs from 'dayjs';

import { environment } from 'src/environments/environment';
import { HotelFilterParameters } from './Core/hotel-filter-params';

@Injectable({
    providedIn: 'root'
})
export class HotelFilterService{
  public name: string = '';
  public country: string = '';
  public city: string = '';
  public checkInDate: string = '';
  public checkOutDate: string = '';
  private readonly autocompleteVariantNumber = 2;
  private readonly apiUrl: string;

  public get filterParameters(): HotelFilterParameters {
    const filter: HotelFilterParameters = {
      name: this.name,
      country: this.country,
      city: this.city,
      checkInDate: this.checkInDate,
      checkOutDate: this.checkOutDate
    };
    return filter;
  }

  public constructor(
    private readonly http: HttpClient
  ) {
    this.apiUrl = environment.api;
  }

  public updateParameters(data: Params | any): void {
    const format = 'YYYY-MM-DD';
    this.name = data.name;
    this.country = data.country;
    this.city = data.city;
    if (data.checkInDate) {
      this.checkInDate = dayjs(new Date(data.checkInDate)).format(format);
    }
    if (data.checkOutDate) {
      this.checkOutDate = dayjs(new Date(data.checkOutDate)).format(format);
    }
  }

  public getHotelNames(enteredName: string): Observable<string[]> {
    const httpParams = new HttpParams()
      .set('name', enteredName)
      .set('number', this.autocompleteVariantNumber);
    return this.http.get<string[]>(
      `${this.apiUrl}api/hotels/names`,
      { params: httpParams }
    );
  }

  public getHotelCountries(enteredCountry: string): Observable<string[]> {
    const httpParams = new HttpParams()
      .set('country', enteredCountry)
      .set('number', this.autocompleteVariantNumber);
    return this.http.get<string[]>(
      `${this.apiUrl}api/hotels/countries`,
      { params: httpParams }
    );
  }

  public getHotelCities(enteredCity: string): Observable<string[]> {
    const httpParams = new HttpParams()
      .set('city', enteredCity)
      .set('number', this.autocompleteVariantNumber);
    return this.http.get<string[]>(
      `${this.apiUrl}api/hotels/cities`,
      { params: httpParams }
    );
  }
}
