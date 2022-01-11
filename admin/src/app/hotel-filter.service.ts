import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { HotelFilterParameters } from './Core/filterParameters';

@Injectable({
    providedIn: 'root'
})
export class HotelFilterService{
  public name: string = '';
  private readonly autocompleteVariantNumber = 2;
  private readonly apiUrl: string;

  public get filterParameters(): HotelFilterParameters {
    const filter: HotelFilterParameters = {
      name: this.name
    };
    return filter;
  }

  public constructor(
    private readonly http: HttpClient
  ) {
    this.apiUrl = environment.api;
  }

  public getHttpParams(): HttpParams {
    const params = this.filterParameters as Params;
    const httpParams = new HttpParams({ fromObject: params } as Params);
    return httpParams;
  }

  public updateParameters(data: Params | any): void {
    this.name = data.name;
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
