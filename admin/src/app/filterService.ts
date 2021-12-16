import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class FilterService{
    public apiUrl: string;
    public constructor(
        private readonly http: HttpClient
    ) {
        this.apiUrl = environment.api;
    }

    public getHotelNames(): Observable<string[]> {
        return this.http.get<string[]>(`${this.apiUrl}api/hotels/countries`);
    }
}