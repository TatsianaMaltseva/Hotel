import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

import { Room } from 'src/app/Dtos/room';
import { HotelService } from 'src/app/hotel.service';

@Component({
  selector: 'app-rooms-for-admin',
  templateUrl: './rooms-for-admin.component.html',
  styleUrls: ['./rooms-for-admin.component.css']
})
export class RoomsForAdminComponent implements OnInit {
  @Input() public hotelId?: number;
  @Input() public roomId?: number;
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
    private readonly hotelService: HotelService
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
        sleeps: ['']
      }
    );
    this.rooms.push(roomForm);
  }

  public deleteRoom(index: number): void {
    this.rooms.removeAt(index);
  }

  private addRooms(room: Room): void {
    let roomForm = this.formBuilder.group(
      { 
        name: [''],
        sleeps: ['']
      }
    );
    roomForm.patchValue(room);
    this.rooms.push(roomForm);
  }
}

//rename element