import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { PageParameters } from 'src/app/Core/pageParameters';
import { HotelCardResponse } from './Core/hotel-card-response';
import { Hotel } from './Dtos/hotel';
import { HotelFilterParameters } from './Core/filterParameters';

@Injectable({
  providedIn: 'root'
})
export class HotelService {
  private readonly apiUrl: string;

  public constructor(
    private readonly http: HttpClient
  ) {
    this.apiUrl = environment.api;
  }

  public getHotel(id: number): Observable<Hotel> {
    return this.http.get<Hotel>(`${this.apiUrl}api/hotels/${id}`);
  }

  public getHotelCards(pageParameters: PageParameters, filterParameters: HotelFilterParameters): Observable<HotelCardResponse> {
    const params = { ...pageParameters, ...filterParameters } as Params;
    const httpParams = new HttpParams({ fromObject: params });
    return this.http.get<HotelCardResponse>(
      `${this.apiUrl}api/hotels`,
      { params: httpParams }
    );
  }

  public editHotel(hotelId: number, editedHotel: Hotel): Observable<any> {
    return this.http.put(
      `${this.apiUrl}api/hotels/${hotelId}`,
      { ...editedHotel }
    );
  }
}