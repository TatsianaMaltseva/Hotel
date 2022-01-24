import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

import { Room } from 'src/app/Dtos/room';
import { Facility } from 'src/app/Dtos/facility';
import { HotelService } from 'src/app/hotel.service';
import { ImageService } from 'src/app/image.service';
import { ImagesDialogComponent } from '../images-dialog/images-dialog.component';
import { ImageDialogData } from 'src/app/Core/image-dialog-data';
import { OrderComponent } from '../order/order.component';
import { AccountService } from 'src/app/account.service';
import { OrderDateParams } from 'src/app/Core/order-date-params';
import { Order } from 'src/app/Dtos/order';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent implements OnInit {
  @Input() public hotelId?: number;

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
  public minDate = new Date();

  public get isClient(): boolean {
    return this.accountService.isClient;
  }

  public get checkInDate(): AbstractControl | null {
    return this.dateForm.get('checkInDate');
  }

  public get checkOutDate(): AbstractControl | null {
    return this.dateForm.get('checkOutDate');
  }

  public constructor(
    private readonly imageService: ImageService,
    private readonly matDialog: MatDialog,
    private readonly hotelService: HotelService,
    private readonly accountService: AccountService,
    private readonly formBuilder: FormBuilder
  ) { 
    this.dateForm = formBuilder. group({
      checkInDate: ['', [Validators.required]],
      checkOutDate: ['', [Validators.required]]
    });
  }

  public ngOnInit(): void {
    this.fetchRooms();
  }

  public changeFacilityStatus(
    event: MatCheckboxChange, 
    room: Room, 
    facility: Facility
  ): void {
    room.facilities
      .filter(f => f.id == facility.id)
      .map(f => f.checked = event.checked);
  }

  public createImagePath(room: Room): string {
    if (this.hotelId === undefined || room.mainImageId === undefined) {
      return '';
    }
    let url = this.imageService
      .createImagePath(
        this.hotelId, 
        room.mainImageId,
        room.id
      );
    return url;
  }

  public showImagesDialog(room: Room): void {
    this.matDialog.open(
      ImagesDialogComponent,
      {
        width: '85%',
        data: { hotelId: this.hotelId, roomId: room.id } as ImageDialogData
      }
    );
  }

  public showReserveDialog(room: Room): void {
    const orderDateParams = new OrderDateParams(
      this.checkInDate?.value, 
      this.checkOutDate?.value
    ).dateParams;
    this.matDialog.open(
      OrderComponent,
      {
        width: '300px',
        data: { room, orderDateParams } as Order 
      }
    );
  }

  public fetchRooms(): void {
    if (this.hotelId === undefined) {
      return;
    }
    let getRooms$: Observable<Room[]>;
    if (this.checkInDate?.value && this.checkOutDate?.value) {
      const date = new OrderDateParams(
        this.checkInDate?.value, 
        this.checkOutDate?.value
      );
      getRooms$ = this.hotelService.getRoomsWithDate(this.hotelId, date);
    } else {
      getRooms$ = this.hotelService.getRooms(this.hotelId);
    }
    getRooms$
      .subscribe(
        (rooms) => {
          this.rooms = rooms;
        }
      );
  }
}
