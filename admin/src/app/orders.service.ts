import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { OrderFilterParams } from './Core/order-filter-params';
import { Order, OrderToShow } from './Dtos/order';
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

  public addRoomToViewed(room: Room): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}api/viewed-rooms/${room.id}`,
      room
    );
  }

  public reserveRoom(order: Order): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}api/orders`,
      order
    );
  }
  
  public getOrders(filterParams: OrderFilterParams): Observable<OrderToShow[]> {
    return this.http.get<OrderToShow[]>(
      `${this.apiUrl}api/orders`,
      { params: filterParams as Params }
    );
  }
}