import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Order } from 'src/app/Dtos/order';
import { OrderService } from 'src/app/orders.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  public order: Order;

  public constructor(
    @Inject(MAT_DIALOG_DATA) public data: Order,
    private readonly orderService: OrderService
  ) { 
    this.order = data;
  }

  public ngOnInit(): void {
    this.calculateOrderPrice();
  }

  public reserveRoom(): void {
    this.orderService
      .reserveRoom(this.order)
      .subscribe();
  }

  private calculateOrderPrice(): void {
    this.orderService
      .calculateOrderPrice(this.order)
      .subscribe(
        totalPrice => {
          this.order.price = totalPrice;
        }
      );
  }
}
