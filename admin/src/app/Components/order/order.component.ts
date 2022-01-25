import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Order } from 'src/app/Dtos/order';
import { Room } from 'src/app/Dtos/room';
import { HotelFilterService } from 'src/app/hotel-filter.service';
import { OrderService } from 'src/app/orders.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  public order: Order;

  public constructor(
    @Inject(MAT_DIALOG_DATA) public room: Room,
    private readonly orderService: OrderService,
    private readonly hotelFilterService: HotelFilterService,
    private readonly dialogRef: MatDialogRef<OrderComponent>
  ) { 
    console.log(room);
    this.order = {
      room: room,
      orderDateParams: {
        checkInDate: this.hotelFilterService.checkInDate,
        checkOutDate: this.hotelFilterService.checkOutDate
      }
    };
  }

  public ngOnInit(): void {
    this.calculateOrderPrice();
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
