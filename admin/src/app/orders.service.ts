import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { Order, OrderToShow } from './Dtos/order';

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

  public reserveRoom(order: Order): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}api/orders`,
      order
    );
  }
  
  public getOrders(): Observable<OrderToShow[]> {
    return this.http.get<OrderToShow[]>(
      `${this.apiUrl}api/orders`
    );
  }
}
