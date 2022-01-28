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
import { OrderDetails } from 'src/app/Dtos/order-details';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent implements OnInit {
  @Input() public hotel?: Hotel;
  public checkInDate: string = '';
  public checkOutDate: string = '';
  public dateForm: FormGroup;
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

  public get IsClient(): boolean {
    return this.accountService.isClient;
  }

  public constructor(
    private readonly imageService: ImageService,
    private readonly matDialog: MatDialog,
    private readonly hotelService: HotelService,
    private readonly formBuilder: FormBuilder,
    private readonly hotelFilterService: HotelFilterService,
    private readonly accountService: AccountService
  ) { 
    this.dateForm = formBuilder.group(
      {
        checkInDate: ['', [Validators.required]],
        checkOutDate: ['', [Validators.required]]
      }
    );
  }

  public ngOnInit(): void {
    this.checkInDate = this.hotelFilterService.checkInDate;
    this.checkOutDate = this.hotelFilterService.checkOutDate;
    this.fetchRooms();
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
    const dialogRef = this.matDialog.open(
      OrderComponent,
      {
        width: '400px',
        data: { room, hotel: this.hotel } as OrderDetails
      }
    );

    dialogRef
      .afterClosed()
      .subscribe(() => {
          this.rooms = this.rooms.filter(room => room.number > 0);
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
