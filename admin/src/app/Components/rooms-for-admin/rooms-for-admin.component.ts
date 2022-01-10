import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ImageDialodData } from 'src/app/Core/imageDialogData';

import { Room } from 'src/app/Dtos/room';
import { HotelService } from 'src/app/hotel.service';
import { ImageService } from 'src/app/image.service';
import { ImagesForAdminDialogComponent } from '../images-for-admin-dialog/images-for-admin-dialog.component';
import { RoomService } from '../room.service';

@Component({
  selector: 'app-rooms-for-admin',
  templateUrl: './rooms-for-admin.component.html',
  styleUrls: ['./rooms-for-admin.component.css']
})
export class RoomsForAdminComponent implements OnInit {
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
  @Input() public hotelId?: number;

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
      ImagesForAdminDialogComponent,
      {
        width: '700px',
        data: { hotelId: this.hotelId, roomId: room.id } as ImageDialodData
      }
    );
  }

  private fetchRooms(): void {
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
