import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';

export interface FilterParameters {
  name: string;
}

@Injectable({
    providedIn: 'root'
})
export class FilterService{
  public apiUrl: string;
  public name: string = '';

  public get filter(): FilterParameters {
    const filter: FilterParameters = {
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
    const params = new HttpParams();
      params.set('name', this.name);
    return params;
  }

  public updateParameters(data: any): void {
    this.name = data.name;
  }

  public getHotelNames(enteredName: string): Observable<string[]> {
    const httpParams = new HttpParams().set('name', enteredName);
    return this.http.get<string[]>(
      `${this.apiUrl}api/hotels/names`,
      { params: httpParams }
    );
  }
}
