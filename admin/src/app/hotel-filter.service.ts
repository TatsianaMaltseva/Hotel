import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { Observable } from 'rxjs';
import * as dayjs from 'dayjs';

import { environment } from 'src/environments/environment';
import { HotelFilterParameters } from './Core/filter-parameters';

@Injectable({
    providedIn: 'root'
})
export class HotelFilterService{
  public name: string = '';
  public checkInDate: string = '';
  public checkOutDate: string = '';
  private readonly autocompleteVariantNumber = 2;
  private readonly apiUrl: string;

  public get filterParameters(): HotelFilterParameters {
    const filter: HotelFilterParameters = {
      name: this.name,
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
    this.checkInDate = dayjs(new Date(data.checkInDate)).format(format);
    this.checkOutDate = dayjs(new Date(data.checkOutDate)).format(format);
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
}
