import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Room } from '../Core/room';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  public constructor(
    private readonly http: HttpClient
  ) {
  }

  public getNumberArray(room: Room): number[] {
    let numberArray: number[] = [];
    for (let i = 1; i <= room.number; i++) {
      numberArray.push(i);
    }
    return numberArray;
  }
}
