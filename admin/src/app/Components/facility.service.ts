import { HttpClient, HttpParams } from '@angular/common/http';
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

  public getCheckedFacilities(hotelId?: number, roomId?: number): Observable<Facility[]> {
    let httpParams = new HttpParams();
    if (hotelId !== undefined) {
      httpParams = httpParams.set('hotelId', `${hotelId}`);
    }
    if (roomId !== undefined) {
      httpParams = httpParams.set('roomId', `${roomId}`);
    }
    return this.http.get<Facility[]>(
      `${this.apiUrl}api/facilities`,
      { params : httpParams }
    );
  }

  public setFacility(hotelId: number, facility: Facility, roomId?: number): Observable<string> {
    if (roomId === undefined) {
      return this.http.put<string>(
        `${this.apiUrl}api/hotels/${hotelId}/facilities`,
        { ...facility}
      );
    }
    return this.http.put<string>(
      `${this.apiUrl}api/hotels/${hotelId}/rooms/${roomId}/facilities`,
      { ...facility }
    );
  }

  public deleteFacilityForHotel(hotelId: number, facilityId: number, roomId?: number): Observable<string> {
    if (roomId === undefined) {
      return this.http.delete<string>(
        `${this.apiUrl}api/hotels/${hotelId}/facilities/${facilityId}`
      );
    }
    return this.http.delete<string>(
      `${this.apiUrl}api/hotels/${hotelId}/rooms/${roomId}/facilities/${facilityId}`
    );
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
    return this.http.put<string>(
      `${this.apiUrl}api/facilities/${facilityId}`,
      { ...editedFacility }
    );
  }
}
