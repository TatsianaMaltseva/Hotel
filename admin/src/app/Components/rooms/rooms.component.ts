import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Room } from 'src/app/Dtos/room';
import { Facility } from 'src/app/Dtos/facility';
import { HotelService } from 'src/app/hotel.service';
import { ImageService } from 'src/app/image.service';
import { ImagesDialogComponent } from '../images-dialog/images-dialog.component';
import { ImageDialogData } from 'src/app/Core/image-dialog-data';
import { OrderComponent } from '../order/order.component';
import { AccountService } from 'src/app/account.service';
import { HotelFilterService } from 'src/app/hotel-filter.service';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent implements OnInit {
  @Input() public hotelId?: number;
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
  public minDate = new Date();

  public get IsLoggedIn(): boolean {
    return this.authService.isLoggedIn;
  }

  public get isClient(): boolean {
    return this.accountService.isClient;
  }

  public constructor(
    private readonly imageService: ImageService,
    private readonly matDialog: MatDialog,
    private readonly hotelService: HotelService,
    private readonly accountService: AccountService,
    private readonly formBuilder: FormBuilder,
    private readonly hotelFilterService: HotelFilterService,
    private readonly authService: AuthService
  ) { 
    this.dateForm = formBuilder. group(
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
    const dialogRef = this.matDialog.open(
      OrderComponent,
      {
        width: '400px',
        data: room 
      }
    );

    dialogRef
      .afterClosed()
      .subscribe(() => {
          this.rooms = this.rooms.filter(room => room.number > 0);
        }
    );
  }

  public fetchRooms(): void {
    if (this.hotelId === undefined) {
      return;
    }
    this.hotelService
      .getRooms(this.hotelId)
      .subscribe(
        (rooms) => {
          this.rooms = rooms;
          this.rooms.filter(room => room.number);
        }
      );
  }
}
