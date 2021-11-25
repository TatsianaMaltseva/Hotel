import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface Hotel {
  hotelId: number;
  name: string;
  country: string;
  sity: string;
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

  public getHotels(pageIndex: number, pageSize: number): Observable<Hotel[]>{
    let params = new URLSearchParams();
    params.set('pageIndex', `${pageIndex}`);
    params.set('pageSize', `${pageSize}`);
    return this.http.get<Hotel[]>(`${this.apiUrl}api/hotels?${params.toString()}`);
  }

  public getHotelsCount(): Observable<number>{
    return this.http.get<number>(`${this.apiUrl}api/hotels/count`);
  }
}