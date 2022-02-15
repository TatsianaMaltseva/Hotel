import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import * as dayjs from 'dayjs';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { HotelFilterParameters } from './Core/hotel-filter-params';

@Injectable({
    providedIn: 'root'
})
export class HotelFilterService{
  public params: HotelFilterParameters = {};
  private readonly autocompleteVariantNumber = 2;
  private readonly apiUrl: string;

  public constructor(
    private readonly http: HttpClient,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {
    this.apiUrl = environment.api;
    this.route.queryParams
      .subscribe(
        params => {
          this.updateParameters(params);
        }
      );
  }

  public updateParameters(data: Params | any): void {
    const format = 'YYYY-MM-DD';
    this.params = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value)
    );

    if (data.checkInDate) {
      this.params.checkInDate = dayjs(new Date(data.checkInDate)).format(format);
    }
    if (data.checkOutDate) {
      this.params.checkOutDate = dayjs(new Date(data.checkOutDate)).format(format);
    }

    void this.router.navigate(
      [],
      { queryParams: this.params }
    );
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
