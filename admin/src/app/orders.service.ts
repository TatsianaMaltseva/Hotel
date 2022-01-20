import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { Room } from './Dtos/room';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private readonly apiUrl: string;
  
  public constructor(
    private readonly http: HttpClient
  ) { 
    this.apiUrl = environment.api;
  }

  public calculateOrderPrice(room: Room): Observable<number> {
    return this.http.post<number>(
      `${this.apiUrl}api/orders`,
      { room }
    );
  }

  public reserveRoom(accountId: number, room: Room): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}api/accounts/${accountId}/orders`,
      { room }
    );
  }
}
