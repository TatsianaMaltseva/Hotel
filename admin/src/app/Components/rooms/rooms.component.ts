import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { Room } from 'src/app/Core/room';
import { HotelService } from 'src/app/hotel.service';
import { ImageForHotelService } from 'src/app/image-for-hotel.service';
import { ImageForFoomService } from '../image-for-foom.service';
import { ImageDialodData, ImagesDialogComponent } from '../images-dialog/images-dialog.component';
import { RoomService } from '../room.service';


@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent implements OnInit {
  public roomsForm: FormGroup;
  public readonly tableColumns: string[] = [
    'image',
    'name', 
    'sleeps', 
    'facilities', 
    'price', 
    'reserve'
  ];
  public numberOfRoomsAvailable = 9;
  public rooms: Room[] = [
    {id: 1, mainImageId: 119, sleeps: 2, name: 'Standart double room', facilities: '-', price: 120, number: 9},
    {id: 2, mainImageId: 119, sleeps: 2, name: 'Cool double room', facilities: '-', price: 180, number: 4},
    {id: 3, mainImageId: 119, sleeps: 3, name: 'Deluxe triple room', facilities: '-', price: 250, number: 3}
  ];
  //@Input() 
  private hotelId?: number = 1021;

  public get roomsReservedNumber(): AbstractControl | null {
    return this.roomsForm.get('roomsReservedNumber');
  }

  public constructor(
    private readonly formBuilder: FormBuilder,
    private readonly imageHotelService: ImageForHotelService,
    private readonly imageRoomService: ImageForFoomService,
    private readonly matDialog: MatDialog,
    private readonly roomService: RoomService,
    private readonly hotelService: HotelService
  ) { 
    this.roomsForm = formBuilder.group(
      {
        roomsReservedNumber: ['']
      }
    );
  }

  public ngOnInit(): void {
    this.fetchRooms();
  }

  public getNumberArray(room: Room): number[] {
    return this.roomService.getNumberArray(room);
  }

  public createImagePath(room: Room): string {
    if (this.hotelId === undefined) {
      return '';
    }
    if (room.mainImageId === undefined) {
      return '';
    }
    let url = this.imageRoomService
      .createImagePath(
        this.hotelId, 
        room.id, 
        room.mainImageId
      );
      return url;
  }

  public showImagesDialog(room: Room): void {
    this.matDialog.open(
      ImagesDialogComponent,
      {
        width: '700px',
        data: { hotelId: this.hotelId, roomId: room.id } as ImageDialodData
      }
    );
  }

  public fetchRooms(): void {
    if (this.hotelId === undefined) {
      return;
    }
    this.hotelService.getRooms(this.hotelId).subscribe(
      (rooms) => {
        this.rooms = rooms;
      }
    );
  }
}
