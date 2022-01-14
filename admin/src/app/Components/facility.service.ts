import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { Facility } from '../Dtos/facility';

@Injectable({
  providedIn: 'root'
})
export class FacilityService {
  private readonly apiUrl: string;

  public constructor(
    private readonly http: HttpClient
  ) {
    this.apiUrl = environment.api;
  }

  public getFacilities(): Observable<Facility[]> {
    return this.http.get<Facility[]>(
      `${this.apiUrl}api/facilities`
    );
  }

  public getFacilitiesFull(hotelId: number, roomId?: number): Observable<Facility[]> {
    if (roomId === undefined) {
      return this.http.get<Facility[]>(`${this.apiUrl}api/hotels/${hotelId}/facilities`);
    }
    return this.http.get<Facility[]>(
      `${this.apiUrl}api/hotels/${hotelId}/rooms/${roomId}/facilities`
    );
  }

  public setFacility(hotelId: number, facilityId: number, roomId?: number): Observable<string> {
    if (roomId === undefined) {
      return this.http.put<string>(
        `${this.apiUrl}api/hotels/${hotelId}/facilities/${facilityId}`,
        {}
      );
    }
    return this.http.put<string>(
      `${this.apiUrl}api/hotels/${hotelId}/rooms/${roomId}/facilities/${facilityId}`,
      {}
    );
  }



  public deleteFacilityForHotel(hotelId: number, facilityId: number): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}api/hotels/${hotelId}/facilities/${facilityId}`);
  }

  public addFacility(facility: Facility): Observable<number> {
    return this.http.post<number>(
      `${this.apiUrl}api/facilities`,
      { ...facility }
    );
  }

  public deleteFacility(facilityId: number): Observable<string> {
    return this.http.delete<string>(
      `${this.apiUrl}api/facilities/${facilityId}`
    );
  }

  public editFacility(facilityId: number, editedFacility: Facility): Observable<string> {
    return this.http.patch<string>(
      `${this.apiUrl}api/facilities/${facilityId}`,
      { ...editedFacility }
    );
  }
}
