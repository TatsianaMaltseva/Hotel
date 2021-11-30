import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PageParameters } from 'src/app/Core/pageParameters';

export interface Hotel {
  hotelId: number;
  name: string;
  country: string;
  city: string;
  address: string;
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

  public getHotels(pageParameters: PageParameters): Observable<Hotel[]>{
    let httpParams = pageParameters.getHttpParams();
    return this.http.get<Hotel[]>(`${this.apiUrl}api/hotels`, { params: httpParams });
  }

  public getHotelsCount(): Observable<number>{
    return this.http.get<number>(`${this.apiUrl}api/hotels/count`);
  }
}