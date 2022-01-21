import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { Order } from './Dtos/order';
import { Room } from './Dtos/room';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly apiUrl: string;
  
  public constructor(
    private readonly http: HttpClient
  ) { 
    this.apiUrl = environment.api;
  }

  public calculateOrderPrice(order: Order): Observable<number> {
    return this.http.post<number>(
      `${this.apiUrl}api/orders/calculate-price`,
      order
    );
  }

  public reserveRoom(order: Order): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}api/orders`,
      order
    );
  }
}
