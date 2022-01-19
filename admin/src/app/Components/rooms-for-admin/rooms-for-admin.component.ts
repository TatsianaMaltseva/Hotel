import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { ImageForAdminDialogData } from 'src/app/Core/image-dialog-admin-data';
import { ImagesForAdminDialogComponent } from '../images-for-admin-dialog/images-for-admin-dialog.component';
import { FacilititesDialogData } from 'src/app/Core/facilities-dialog-data';
import { ChooseFacilitiesForAdminComponent } from '../choose-facilities-for-admin/choose-facilities-for-admin.component';
import { roomParamsMaxLength } from 'src/app/Core/validation-params';
import { HotelService } from 'src/app/hotel.service';
import { ImageService } from 'src/app/image.service';
import { RoomService } from '../../room.service';
import { Hotel } from 'src/app/Dtos/hotel';
import { Room } from 'src/app/Dtos/room';

@Component({
  selector: 'app-rooms-for-admin',
  templateUrl: './rooms-for-admin.component.html',
  styleUrls: ['./rooms-for-admin.component.css']
})
export class RoomsForAdminComponent implements OnInit {
  @Input() public hotel?: Hotel;
  
  public hotelId?: number;
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
    if (!this.hotel) {
      return;
    }
    this.hotelId = this.hotel.id;
    this.hotelService
      .getRooms(this.hotel.id)
      .subscribe(
        (rooms) => {
          rooms.forEach(room => {
            this.addRoomToForm(room);
          });
        }
      );
  }

  public roomExistsInDatabase(room: Room): boolean {
    return !!room.id;
  }

  public addEmptyRoomCard(): void {
    const roomForm = this.emptyRoomForm;
    this.rooms.push(roomForm);
  }

  public deleteEmptyRoomCard(index: number): void {
    if (!this.hotel) {
      return;
    }
    this.rooms.removeAt(index);
  }

  public addRoom(room: Room): void {
    if (!this.hotel) {
      return;
    }
    this.roomService
      .addRoom(this.hotel.id, room)
      .subscribe(
        (id) => {
          room.id = id;
        }
      );
  }

  public deleteRoom(index: number, room: Room): void {
    if (!this.hotel) {
      return;
    }
    this.roomService
      .deleteRoom(this.hotel.id, room.id)
      .subscribe(
        () => {
          this.rooms.removeAt(index);
        }
      );
  }

  public editRoom(room: Room): void {
    if (!this.hotel) {
      return;
    }
    this.roomService
      .editRoom(this.hotel.id, room.id, room)
      .subscribe();
  }

  public createImagePath(room: Room): string {
    if (!this.hotel || !room.mainImageId) {
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
    this.matDialog.open(
      ImagesForAdminDialogComponent,
      {
        width: '85%',
        data: { hotel: this.hotel, room: room } as ImageForAdminDialogData
      }
    );
  }

  public openFacilitiesDialog(room: Room): void {
    this.matDialog.open(
      ChooseFacilitiesForAdminComponent,
      {
        width: '600px',
        data: { hotelId: this.hotelId, roomId: room.id } as FacilititesDialogData
      }
    );
  }

  private addRoomToForm(room: Room): void {
    const roomForm = this.emptyRoomForm;
    roomForm.patchValue(room);
    this.rooms.push(roomForm);
  }
}
