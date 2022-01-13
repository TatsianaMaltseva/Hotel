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

  public getFacilies(): Observable<Facility[]> {
    return this.http.get<Facility[]>(
      `${this.apiUrl}api/facilities`
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
    return this.http.patch<string>(
      `${this.apiUrl}api/facilities/${facilityId}`,
      { ...editedFacility }
    );
  }
}
