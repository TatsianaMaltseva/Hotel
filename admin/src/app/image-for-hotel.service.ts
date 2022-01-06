import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { Image } from './Dtos/image';

@Injectable({
  providedIn: 'root'
})
export class ImageForHotelService {
  private readonly apiUrl: string;

  public constructor(
    private readonly http: HttpClient
  ) {
    this.apiUrl = environment.api;
  }

  public createImagePath(hotelId: number, imageId: number): string {
    return `${this.apiUrl}api/hotels/${hotelId}/images/${imageId}`;
  }

  public postImage(files: FileList | null, hotelId: number): Observable<any> {
    const fileToUpload = files?.[0] as File;
    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    return this.http.post(
      `${this.apiUrl}api/hotels/${hotelId}/images`, 
      formData,
      { reportProgress: true, observe: 'events' }
    );
  }
  public getImages(hotelId: number): Observable<Image[]>{
    return this.http.get<Image[]>(`${this.apiUrl}api/hotels/${hotelId}/images`);
  }

  public deleteImage(hotelId: number, image: Image): Observable<string>{
    return this.http.delete<string>(`${this.apiUrl}api/hotels/${hotelId}/images/${image.id}`);
  }
}