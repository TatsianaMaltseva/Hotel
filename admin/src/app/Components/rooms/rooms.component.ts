import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatCheckboxChange } from '@angular/material/checkbox';

import { Room } from 'src/app/Dtos/room';
import { Facility } from 'src/app/Dtos/facility';
import { HotelService } from 'src/app/hotel.service';
import { ImageService } from 'src/app/image.service';
import { ImagesDialogComponent } from '../images-dialog/images-dialog.component';
import { ImageDialogData } from 'src/app/Core/image-dialog-data';
import { OrderComponent } from '../order/order.component';
import { AccountService } from 'src/app/account.service';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent implements OnInit {
  @Input() public hotelId?: number;

  public readonly tableColumns: string[] = [
    'image',
    'name', 
    'sleeps', 
    'facilities', 
    'price', 
    'reserve'
  ];
  public rooms: Room[] = [];

  public get isClient(): boolean {
    return this.accountService.isClient;
  }

  public constructor(
    private readonly imageService: ImageService,
    private readonly matDialog: MatDialog,
    private readonly hotelService: HotelService,
    private readonly accountService: AccountService
  ) { 
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
    this.matDialog.open(
      OrderComponent,
      {
        width: '300px',
        data: room
      }
    );
  }

  private fetchRooms(): void {
    if (this.hotelId === undefined) {
      return;
    }
    this.hotelService
      .getRooms(this.hotelId)
      .subscribe(
        (rooms) => {
          this.rooms = rooms;
        }
      );
  }
}
