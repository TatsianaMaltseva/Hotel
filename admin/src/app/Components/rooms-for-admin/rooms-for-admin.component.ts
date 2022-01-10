import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ImageDialogData } from 'src/app/Core/image-dialog-data';

import { Room } from 'src/app/Dtos/room';
import { HotelService } from 'src/app/hotel.service';
import { ImageService } from 'src/app/image.service';
import { ImagesForAdminDialogComponent } from '../images-for-admin-dialog/images-for-admin-dialog.component';

@Component({
  selector: 'app-rooms-for-admin',
  templateUrl: './rooms-for-admin.component.html',
  styleUrls: ['./rooms-for-admin.component.css']
})
export class RoomsForAdminComponent implements OnInit {
  @Input() public hotelId?: number;
  public readonly tableColumns: string[] = [
    'name', 
    'sleeps'
  ];

  public roomsForm: FormGroup;

  public get rooms(): FormArray {
    return this.roomsForm.get('rooms') as FormArray;
  }

  public constructor(
    private readonly formBuilder: FormBuilder,
    private readonly hotelService: HotelService,
    private readonly imageService: ImageService,
    private readonly matDialog: MatDialog
  ) {
    this.roomsForm = this.formBuilder.group(
      {
        rooms: this.formBuilder.array([])
      }
    );
  }

  public ngOnInit(): void {
    if (this.hotelId === undefined) {
      return;
    }
    this.hotelService
      .getRooms(this.hotelId)
      .subscribe(
        (rooms) => {
          rooms.map(room => this.addRooms(room));
        }
      );
  }

  public addRoom(): void {
    const roomForm = this.formBuilder.group(
      {
        name: [''],
        sleeps: [''],
        mainImageId: []
      }
    );
    this.rooms.push(roomForm);
  }

  public deleteRoom(index: number): void {
    this.rooms.removeAt(index);
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
    console.log(room);
    this.matDialog.open(
      ImagesForAdminDialogComponent,
      {
        width: '85%',
        data: { hotelId: this.hotelId, roomId: room.id } as ImageDialogData
      }
    );
  }

  private addRooms(room: Room): void {
    let roomForm = this.formBuilder.group(
      { 
        id: [],
        name: [''],
        sleeps: [''],
        mainImageId: [],
        facilities: [],
        price: []
      }
    );
    roomForm.patchValue(room);
    this.rooms.push(roomForm);
  }
}
