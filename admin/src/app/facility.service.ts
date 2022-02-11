import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { Facility, Realm } from './Dtos/facility';

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
    return this.http.get<Facility[]>(`${this.apiUrl}api/facilities`);
  }

  public getCheckedFacilities(hotelId?: number, roomId?: number): Observable<Facility[]> {
    let httpParams = new HttpParams();
    if (hotelId) {
      httpParams = httpParams.set('realm', Realm.hotel);
    }
    if (roomId) {
      httpParams = httpParams.set('realm', Realm.room);
    }
    return this.http.get<Facility[]>(
      `${this.apiUrl}api/facilities`,
      { params : httpParams }
    );
  }

  public changeFacilities(hotelId: number, facilities: Facility[], roomId?: number): Observable<string> {
    if (!roomId) {
      facilities.map(f => f.realm = Realm.hotel);
      return this.http.put<string>(
        `${this.apiUrl}api/hotels/${hotelId}/facilities`,
        facilities
      );
    }
    facilities.map(f => f.realm = Realm.room);
    return this.http.put<string>(
      `${this.apiUrl}api/hotels/${hotelId}/rooms/${roomId}/facilities`,
      facilities
    );
  }

  public addFacility(facility: Facility): Observable<number> {
    return this.http.post<number>(
      `${this.apiUrl}api/facilities`,
      facility
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
      editedFacility
    );
  }
}
