import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Image } from '../Dtos/image';

@Injectable({
  providedIn: 'root'
})
export class ImageForFoomService {
  private readonly apiUrl: string;

  public constructor(    
    private readonly http: HttpClient
  ) {
    this.apiUrl = environment.api;
  }

  public createImagePath(hotelId: number, roomId: number, imageId: number): string {
    return `${this.apiUrl}api/hotels/${hotelId}/rooms/${roomId}/images/${imageId}`;
  }

  public postImage(files: FileList | null, hotelId: number, roomId: number): Observable<any> {
    const fileToUpload = files?.[0] as File;
    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    return this.http.post(
      `${this.apiUrl}api/hotels/${hotelId}/rooms/${roomId}/images`, 
      formData,
      { reportProgress: true, observe: 'events' }
    );
  }

  public getImages(hotelId: number, roomId: number): Observable<Image[]>{
    return this.http.get<Image[]>(
      `${this.apiUrl}api/hotels/${hotelId}/rooms/${roomId}/images`
    );
  }

  public deleteImage(hotelId: number, roomId: number, imageId: number): Observable<string>{
    return this.http.delete<string>(
      `${this.apiUrl}api/hotels/${hotelId}/rooms/${roomId}/images/${imageId}`
    );
  }
}
