import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { AccountService } from './account.service';
import { OrderFilterParams } from './Core/order-filter-params';
import { Order, OrderToAdd } from './Dtos/order';
import { Room } from './Dtos/room';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly apiUrl: string;

  private get accountId(): number | null {
    return this.accountService.accountId;
  }

  public constructor(
    private readonly http: HttpClient,
    private readonly accountService: AccountService
  ) {
    this.apiUrl = environment.api;
  }

  public addRoomToViewed(room: Room): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}api/viewed-rooms/${room.id}`,
      room
    );
  }

  public reserveRoom(order: OrderToAdd): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}api/accounts/${this.accountId}/orders`,
      order
    );
  }

  public getOrders(filterParams: OrderFilterParams): Observable<Order[]> {
    return this.http.get<Order[]>(
      `${this.apiUrl}api/accounts/${this.accountId}/orders`,
      { params: filterParams as Params }
    );
  }
}
