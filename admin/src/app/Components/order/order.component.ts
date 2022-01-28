import { Component, Inject } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Facility } from 'src/app/Dtos/facility';
import * as dayjs from 'dayjs';

import { Order } from 'src/app/Dtos/order';
import { OrderDetails } from 'src/app/Dtos/order-details';
import { HotelFilterService } from 'src/app/hotel-filter.service';
import { OrderService } from 'src/app/orders.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent {
  public order: Order;
  public days: number;

  public constructor(
    @Inject(MAT_DIALOG_DATA) public orderDetails: OrderDetails,
    private readonly orderService: OrderService,
    private readonly hotelFilterService: HotelFilterService,
    private readonly dialogRef: MatDialogRef<OrderComponent>
  ) {
    this.order = {
      room: orderDetails.room,
      hotel: orderDetails.hotel,
      orderDateParams: {
        checkInDate: this.hotelFilterService.checkInDate,
        checkOutDate: this.hotelFilterService.checkOutDate
      },
      price: orderDetails.room.price
    };
    this.days = dayjs(this.order.orderDateParams.checkOutDate).diff(
      dayjs(this.order.orderDateParams.checkInDate), 
      'day') + 1;
  }

  public changeRoomFacilityStatus(
    event: MatCheckboxChange, 
    facility: Facility
  ): void {
    this.order.room.facilities
      .filter(f => f.id == facility.id)
      .map(f => f.checked = event.checked);
    if (event.checked) {
      this.order.price += facility.price;
    } else {
      this.order.price -= facility.price;
    }
  }

  public changeHotelFacilityStatus(
    event: MatCheckboxChange, 
    facility: Facility
  ): void {
    this.order.hotel.facilities
      .filter(f => f.id == facility.id)
      .map(f => f.checked = event.checked);
    if (event.checked) {
      this.order.price += facility.price;
    } else {
      this.order.price -= facility.price;
    }
  }

  public reserveRoom(): void {
    this.orderService
      .reserveRoom(this.order)
      .subscribe(
        () => {
          this.order.room.number -= 1;
          this.dialogRef.close();
        }
      );
  }
}
