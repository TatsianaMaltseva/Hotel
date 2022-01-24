import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { PageParameters } from 'src/app/Core/page-parameters';
import { HotelCardResponse } from './Core/hotel-card-response';
import { Hotel, HotelToAdd, HotelToEdit } from './Dtos/hotel';
import { Room } from './Dtos/room';
import { HotelFilterParameters } from './Core/filter-parameters';
import { OrderDateParams } from './Core/order-date-params';

export interface OrderDate {
  startDate: Date;
  endDate: Date;
} 

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

  public getHotel(hotelId: number): Observable<Hotel> {
    return this.http.get<Hotel>(`${this.apiUrl}api/hotels/${hotelId}`);
  }

  public getHotelCards(pageParameters: PageParameters, filterParameters: HotelFilterParameters): Observable<HotelCardResponse> {
    const params = { ...pageParameters, ...filterParameters } as Params;
    const httpParams = new HttpParams({ fromObject: params });
    return this.http.get<HotelCardResponse>(
      `${this.apiUrl}api/hotels`,
      { params: httpParams }
    );
  }

  public editHotel(hotelId: number, editedHotel: HotelToEdit): Observable<string> {
    return this.http.put<string>(
      `${this.apiUrl}api/hotels/${hotelId}`,
      { ...editedHotel }
    );
  }

  public getHotelsCount(filterParameters: HotelFilterParameters): Observable<number> {
    const httpParams = filterParameters as Params;
    return this.http.get<number>(`${this.apiUrl}api/hotels/count`, { params: httpParams });
  }

  public getRooms(hotelId: number): Observable<Room[]> {
    return this.http.get<Room[]>(
      `${this.apiUrl}api/hotels/${hotelId}/rooms`
    );
  }

  public getRoomsWithDate(hotelId: number, date: OrderDateParams): Observable<Room[]> {
    const params = new HttpParams({ fromObject: date.dateParamsFormatted as Params });
    return this.http.get<Room[]>(
      `${this.apiUrl}api/hotels/${hotelId}/rooms`,
      { params: params }
    );
  }

  public addHotel(hotel: HotelToAdd): Observable<number> {
    return this.http.post<number>(
      `${this.apiUrl}api/hotels`,
      { ...hotel }
    );
  }
}