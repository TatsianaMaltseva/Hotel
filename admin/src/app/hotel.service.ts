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

  public getHotels(): Observable<Hotel[]>{
    return this.http.get<Hotel[]>(`${this.apiUrl}api/hotels`);
  }
}
