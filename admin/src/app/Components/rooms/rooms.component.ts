import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { Room } from 'src/app/Dtos/room';
import { HotelService } from 'src/app/hotel.service';
import { ImageService } from 'src/app/image.service';
import { ImagesDialogComponent } from '../images-dialog/images-dialog.component';
import { RoomService } from '../../room.service';
import { ImageDialogData } from 'src/app/Core/image-dialog-data';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent implements OnInit {
  @Input() public hotelId?: number;
  
  public roomsForm: FormGroup;
  public readonly tableColumns: string[] = [
    'image',
    'name', 
    'sleeps', 
    'facilities', 
    'price', 
    'reserve'
  ];
  public rooms: Room[] = [];

  public get roomsReservedNumber(): AbstractControl | null {
    return this.roomsForm.get('roomsReservedNumber');
  }

  public constructor(
    private readonly formBuilder: FormBuilder,
    private readonly imageService: ImageService,
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
