import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AccountService } from 'src/app/account.service';
import { Order } from 'src/app/Dtos/order';

import { Room } from 'src/app/Dtos/room';
import { OrdersService } from 'src/app/orders.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  public room: Room;
  public totalPrice?: number;

  private get accountId(): number | null {
    return this.accountService.id;
  }

  public constructor(
    @Inject(MAT_DIALOG_DATA) public data: Room,
    private readonly ordersService: OrdersService,
    private readonly accountService: AccountService
  ) { 
    this.room = data;
  }

  public ngOnInit(): void {
    this.calculateOrderPrice();
  }

  public reserveRoom(): void {
    console.log(this.accountId);
    //this.accountId = 2185;
    // if (!this.accountId) {
    //   return;
    // }
    this.ordersService
      .reserveRoom(2185, this.room)
      .subscribe();
  }

  private calculateOrderPrice(): void {
    this.ordersService
      .calculateOrderPrice(this.room)
      .subscribe(
        totalPrice => {
          this.totalPrice = totalPrice;
        }
      );
  }
}
