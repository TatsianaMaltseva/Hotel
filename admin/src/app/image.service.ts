import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { Image } from './Dtos/image';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private readonly apiUrl: string;

  public constructor(
    private readonly http: HttpClient
  ) {
    this.apiUrl = environment.api;
  }

  public createImagePath(hotelId: number, imageId: number, roomId?: number): string {
    if (roomId === undefined){
      return `${this.apiUrl}api/hotels/${hotelId}/images/${imageId}`;
    }
    return `${this.apiUrl}api/hotels/${hotelId}/rooms/${roomId}/images/${imageId}`;
  }

  public postImage(files: FileList | null, hotelId: number, roomId?: number): Observable<any> {
    const fileToUpload = files?.[0] as File;
    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    let httpUrl = '';
    if (roomId === undefined){
      httpUrl = `${this.apiUrl}api/hotels/${hotelId}/images`;
    } else {
      httpUrl = `${this.apiUrl}api/hotels/${hotelId}/rooms/${roomId}/images`;
    }
    return this.http.post(
      httpUrl,
      formData,
      { reportProgress: true, observe: 'events' }
    );
  }
  public getImages(hotelId: number, roomId?: number): Observable<Image[]>{
    if (roomId === undefined){
      return this.http.get<Image[]>(`${this.apiUrl}api/hotels/${hotelId}/images`);
    }
    return this.http.get<Image[]>(
      `${this.apiUrl}api/hotels/${hotelId}/rooms/${roomId}/images`
    );
  }

  public deleteImage(hotelId: number, imageId: number, roomId?: number): Observable<string>{
    if (roomId === undefined){
      return this.http.delete<string>(`${this.apiUrl}api/hotels/${hotelId}/images/${imageId}`);
    }
    return this.http.delete<string>(
      `${this.apiUrl}api/hotels/${hotelId}/rooms/${roomId}/images/${imageId}`
    );
  }
}