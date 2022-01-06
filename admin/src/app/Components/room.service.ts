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

  public changeMainImage(hotelId: number, roomId: number, image: Image): Observable<string> {
    return this.http.put<string>(
      `${this.apiUrl}api/hotels/${hotelId}/rooms/${roomId}/images`,
      { id: image.id }
    );
  }
}
