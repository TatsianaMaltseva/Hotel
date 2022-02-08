import { Component, Inject } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as dayjs from 'dayjs';

import { Facility } from 'src/app/Dtos/facility';
import { Order } from 'src/app/Dtos/order';
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
    @Inject(MAT_DIALOG_DATA) public orderDetails: Order,
    private readonly orderService: OrderService,
    private readonly hotelFilterService: HotelFilterService,
    private readonly dialogRef: MatDialogRef<OrderComponent>
  ) {
      this.order = {
        room: orderDetails.room,
        hotel: orderDetails.hotel,
        checkInDate: this.hotelFilterService.checkInDate,
        checkOutDate: this.hotelFilterService.checkOutDate,
        price: orderDetails.room.price,
        facilities: orderDetails.facilities
      };
      this.days = dayjs(this.order.checkOutDate)
        .diff(
          dayjs(this.order.checkInDate),
          'day'
          )
        + 1;
  }

  public changeFacilityStatus(
    event: MatCheckboxChange,
    facility: Facility
  ): void {
    this.order.facilities
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
      .reserveRoom({
        hotelId: this.order.hotel.id,
        roomId: this.order.room.id,
        facilityIds: this.order.facilities
          .filter(facility => facility.checked)
          .map(facility =>  facility.id),
        checkInDate: this.order.checkInDate,
        checkOutDate: this.order.checkOutDate
      })
      .subscribe(
        () => {
          this.order.room.number -= 1;
          this.dialogRef.close();
        }
      );
  }
}
