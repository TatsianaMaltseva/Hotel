import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Image } from '../Dtos/image';
import { environment } from 'src/environments/environment';
import { Room } from '../Dtos/room';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private readonly apiUrl: string;

  public constructor(
    private readonly http: HttpClient
  ) {
    this.apiUrl = environment.api;
  }

  public getNumberArray(room: Room): number[] {
    let numberArray: number[] = [];
    for (let i = 1; i <= room.number; i++) {
      numberArray.push(i);
    }
    return numberArray;
  }

  public editRoom(hotelId: number, roomId: number, editedRoom: Room): Observable<string> {
    return this.http.patch<string>(
      `${this.apiUrl}api/hotels/${hotelId}/rooms/${roomId}`,
      { ...editedRoom }
    );
  }

  public changeMainImage(hotelId: number, image: Image, roomId: number): Observable<string> {
    return this.http.patch<string>(
      `${this.apiUrl}api/hotels/${hotelId}/rooms/${roomId}`,
      { mainImageId: image.id }
    );
  }

  public deleteRoom(hotelId: number, roomId: number): Observable<string> {
    return this.http.delete<string>(
      `${this.apiUrl}api/hotels/${hotelId}/rooms/${roomId}`
    );
  }

  public addRoom(hotelId: number, room: Room): Observable<any> {
    return this.http.post(
      `${this.apiUrl}api/hotels/${hotelId}/rooms`,
      { ...room }
    );
  }
}
