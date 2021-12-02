import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PageParameters } from 'src/app/Core/pageParameters';

export interface HotelDto {
  hotelId: number;
  name: string;
  country: string;
  city: string;
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

  public getHotels(pageParameters: PageParameters): Observable<HotelDto[]>{
    let httpParams = pageParameters.getHttpParams();
    return this.http.get<HotelDto[]>(`${this.apiUrl}api/hotels`, { params: httpParams });
  }

  public getHotelsCount(): Observable<number>{
    return this.http.get<number>(`${this.apiUrl}api/hotels/count`);
  }
}