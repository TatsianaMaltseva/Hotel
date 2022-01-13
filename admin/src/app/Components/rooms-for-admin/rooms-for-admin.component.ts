import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { ImageForAdminDialogData } from 'src/app/Core/image-dialog-admin-data';
import { roomParamsMaxLength } from 'src/app/Core/validation-params';
import { Room } from 'src/app/Dtos/room';
import { HotelService } from 'src/app/hotel.service';
import { ImageService } from 'src/app/image.service';
import { RoomService } from '../room.service';
import { ImagesForAdminDialogComponent } from '../images-for-admin-dialog/images-for-admin-dialog.component';

@Component({
  selector: 'app-rooms-for-admin',
  templateUrl: './rooms-for-admin.component.html',
  styleUrls: ['./rooms-for-admin.component.css']
})
export class RoomsForAdminComponent implements OnInit {
  @Input() public hotelId?: number;

  public roomsForm: FormGroup;

  public get rooms(): FormArray {
    return this.roomsForm.get('rooms') as FormArray;
  }

  private get emptyRoomForm(): FormGroup {
    const roomForm = this.formBuilder.group(
      {
        id: [],
        name: [
          '',
          [ 
            Validators.required, 
            Validators.maxLength(roomParamsMaxLength.name)
          ]
        ],
        sleeps: ['', Validators.required],
        mainImageId: [],
        facilities: [],
        price: ['', Validators.required],
        number: ['', Validators.required]
      }
    );
    return roomForm;
  }

  public constructor(
    private readonly formBuilder: FormBuilder,
    private readonly hotelService: HotelService,
    private readonly imageService: ImageService,
    private readonly matDialog: MatDialog,
    private readonly roomService: RoomService
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
          rooms.forEach(room => this.addRoomToForm(room));
        }
      );
  }

  public roomExistsInDatabase(room: Room): boolean {
    return Boolean(room.id);
  }

  public addEmptyRoomCard(): void {
    const roomForm = this.emptyRoomForm;
    this.rooms.push(roomForm);
  }

  public deleteEmptyRoomCard(index: number): void {
    if (this.hotelId === undefined) {
      return;
    }
    this.rooms.removeAt(index);
  }

  public addRoom(room: Room): void {
    if (this.hotelId === undefined) {
      return;
    }
    this.roomService
      .addRoom(this.hotelId, room)
      .subscribe(
        (id) => {
          room.id = id;
        }
      );
  }

  public deleteRoom(index: number, room: Room): void {
    if (this.hotelId === undefined) {
      return;
    }
    this.roomService
      .deleteRoom(this.hotelId, room.id)
      .subscribe(
        () => {
          this.rooms.removeAt(index);
        }
      );
  }

  public editRoom(room: Room): void {
    if (this.hotelId === undefined) {
      return;
    }
    this.roomService
      .editRoom(this.hotelId, room.id, room)
      .subscribe();
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
        width: '85%',
        data: { hotelId: this.hotelId, room: room } as ImageForAdminDialogData
      }
    );
  }

  private addRoomToForm(room: Room): void {
    const roomForm = this.emptyRoomForm;
    roomForm.patchValue(room);
    this.rooms.push(roomForm);
  }
}
