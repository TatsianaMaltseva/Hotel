import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { Room } from './Dtos/room';

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

  public editRoom(hotelId: number, roomId: number, editedRoom: Room): Observable<string> {
    return this.http.put<string>(
      `${this.apiUrl}api/hotels/${hotelId}/rooms/${roomId}`,
      { ...editedRoom }
    );
  }

  public deleteRoom(hotelId: number, roomId: number): Observable<string> {
    return this.http.delete<string>(
      `${this.apiUrl}api/hotels/${hotelId}/rooms/${roomId}`
    );
  }

  public addRoom(hotelId: number, room: Room): Observable<number> {
    return this.http.post<number>(
      `${this.apiUrl}api/hotels/${hotelId}/rooms`,
      { ...room }
    );
  }
}
