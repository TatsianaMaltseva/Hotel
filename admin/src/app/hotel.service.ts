import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { PageParameters } from 'src/app/Core/pageParameters';
import { HotelCard } from './Dtos/hotelCard';
import { Hotel } from './Dtos/hotel';

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

  public getHotels(pageParameters: PageParameters): Observable<HotelCard[]> {
    const httpParams = pageParameters.getHttpParams();
    return this.http.get<HotelCard[]>(`${this.apiUrl}api/hotels`, { params: httpParams });
  }

  public editHotel(hotelId: number, editedHotel: Hotel): Observable<any> {
    return this.http.put(
      `${this.apiUrl}api/hotels/${hotelId}`,
      { ...editedHotel }
    );
  }

  public getHotelsCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}api/hotels/count`);
  }
}