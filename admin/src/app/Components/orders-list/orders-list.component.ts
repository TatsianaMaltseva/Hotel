import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';

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

  public get date(): AbstractControl | null {
    return this.ordersFilterForm.get('date');
  }

  public get country(): AbstractControl | null {
    return this.ordersFilterForm.get('country');
  }

  public get city(): AbstractControl | null {
    return this.ordersFilterForm.get('city');
  }

  public constructor(
    private readonly orderService: OrderService,
    private readonly formBuilder: FormBuilder
  ) {
    this.ordersFilterForm = formBuilder.group(
      {
        date: [OrderFilterDateOptions.future],
        country: [],
        city: []
      }
    );
  }

  public ngOnInit(): void {
    this.fetchOrders();
  }

  public updateFilterParameters(): void {
    this.fetchOrders();
  }

  private fetchOrders(): void {
    const filterParams: OrderFilterParams = this.ordersFilterForm.value as OrderFilterParams;
    if (!filterParams.country) {
      delete filterParams.country;
    }
    if (!filterParams.city) {
      delete filterParams.city;
    }
    this.orderService
      .getOrders(filterParams)
      .subscribe(
        (orders: Order[]) => {
          this.orders = orders;
        }
      );
  }
}
