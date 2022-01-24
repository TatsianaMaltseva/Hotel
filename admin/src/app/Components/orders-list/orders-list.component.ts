import { Component, OnInit } from '@angular/core';
import { OrderToShow } from 'src/app/Dtos/order';
import { OrderService } from 'src/app/orders.service';

@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.css']
})
export class OrdersListComponent implements OnInit {
  public orders: OrderToShow[] = [];

  public constructor(
    private readonly orderService: OrderService
  ) { 
  }

  public ngOnInit(): void {
    this.orderService
    .getOrders()
    .subscribe(
      (orders: OrderToShow[]) => {
        this.orders = orders;
        console.log(this.orders);
      }
    );
  }
}
