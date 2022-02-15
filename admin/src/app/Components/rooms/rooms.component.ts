import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Room } from 'src/app/Dtos/room';
import { HotelService } from 'src/app/hotel.service';
import { ImageService } from 'src/app/image.service';
import { ImagesDialogComponent } from '../images-dialog/images-dialog.component';
import { ImageDialogData } from 'src/app/Core/image-dialog-data';
import { OrderComponent } from '../order/order.component';
import { AccountService } from 'src/app/account.service';
import { HotelFilterService } from 'src/app/hotel-filter.service';
import { Hotel } from 'src/app/Dtos/hotel';
import { OrderService } from 'src/app/orders.service';
import { Facility } from 'src/app/Dtos/facility';
import { Order } from 'src/app/Dtos/order';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent implements OnInit {
  @Input() public hotel?: Hotel;

  public roomFilterForm: FormGroup;
  public today = new Date();
  public readonly tableColumns: string[] = [
    'image',
    'name',
    'sleeps',
    'facilities',
    'price',
    'number',
    'reserve'
  ];
  public rooms: Room[] = [];
  public areAllShownRoomsAvailable: boolean = false;

  public get isAdmin(): boolean {
    return this.accountService.isAdmin;
  }

  public constructor(
    private readonly imageService: ImageService,
    private readonly matDialog: MatDialog,
    private readonly hotelService: HotelService,
    private readonly formBuilder: FormBuilder,
    private readonly hotelFilterService: HotelFilterService,
    private readonly orderService: OrderService,
    private readonly accountService: AccountService
  ) {
    this.roomFilterForm = formBuilder.group(
      {
        sleeps: [this.hotelFilterService.params.sleeps],
        checkInDate: [
          this.hotelFilterService.params.checkInDate,
          [Validators.required]
        ],
        checkOutDate: [
          this.hotelFilterService.params.checkOutDate,
          [Validators.required]
        ]
      }
    );
  }

  public ngOnInit(): void {
    console.log(this.hotelFilterService.params);
    if (this.hotelFilterService.params.checkInDate && this.hotelFilterService.params.checkOutDate) {
      this.areAllShownRoomsAvailable = true;
    }

    this.roomFilterForm
      .valueChanges
      .subscribe(
        () =>
          this.areAllShownRoomsAvailable = false
      );

    if (this.areAllShownRoomsAvailable || this.isAdmin) {
      this.fetchRooms();
    }
  }

  public loadAvailableRooms(): void {
    this.hotelFilterService.updateParameters(this.roomFilterForm.value);
    this.fetchRooms();
    this.areAllShownRoomsAvailable = true;
  }

  public createImagePath(room: Room): string {
    if (!this.hotel || room.mainImageId === undefined) {
      return '';
    }
    let url = this.imageService
      .createImagePath(
        this.hotel.id,
        room.mainImageId,
        room.id
      );
    return url;
  }

  public showImagesDialog(room: Room): void {
    if (!this.hotel) {
      return;
    }
    this.matDialog.open(
      ImagesDialogComponent,
      {
        width: '85%',
        data: { hotelId: this.hotel.id, roomId: room.id } as ImageDialogData
      }
    );
  }

  public showReserveDialog(room: Room): void {
    if (!this.hotel) {
      return;
    }

    this.orderService
      .addRoomToViewed(room)
      .subscribe(
        () => {
          const dialogRef = this.matDialog.open(
            OrderComponent,
            {
              width: '400px',
              data: {
                hotel: this.hotel,
                room: room,
                facilities: [ ...this.hotel!.facilities, ...room.facilities ] as Facility[]
              } as Order
            }
          );

          dialogRef
            .afterClosed()
            .subscribe(
              () => {
                this.rooms = this.rooms.filter(room => room.number > 0);
              }
            );
        }
      );
  }

  private fetchRooms(): void {
    if (!this.hotel) {
      return;
    }
    this.hotelService
      .getRooms(this.hotel.id)
      .subscribe(
        (rooms) => {
          this.rooms = rooms;
        }
      );
  }
}
