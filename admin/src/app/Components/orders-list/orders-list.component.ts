import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { OrderFilterDateOptions } from 'src/app/Core/order-filter-date-options';
import { OrderFilterParams } from 'src/app/Core/order-filter-params';
import { Order } from 'src/app/Dtos/order';
import { OrderService } from 'src/app/orders.service';

@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.css']
})
export class OrdersListComponent implements OnInit {
  public orders: Order[] = [];
  public ordersFilterForm: FormGroup;
  public dateOptions = [OrderFilterDateOptions.future, OrderFilterDateOptions.past];

  public constructor(
    private readonly orderService: OrderService,
    private readonly formBuilder: FormBuilder
  ) {
    this.ordersFilterForm = formBuilder.group(
      {
        date: [OrderFilterDateOptions.future]
      }
    );
  }

  public ngOnInit(): void {
    this.fetchOrders();
  }

  public onDateFilterChange(): void {
    this.fetchOrders();
  }

  private fetchOrders(): void {
    this.orderService
      .getOrders(this.ordersFilterForm.value as OrderFilterParams)
      .subscribe(
        (orders: Order[]) => {
          this.orders = orders;
        }
      );
  }
}
