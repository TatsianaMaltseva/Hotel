import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { ImagesResponse } from './Core/images-response';
import { PageParameters } from './Core/page-parameters';

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
    if (roomId === undefined) {
      return `${this.apiUrl}api/hotels/${hotelId}/images/${imageId}`;
    }
    return `${this.apiUrl}api/hotels/${hotelId}/rooms/${roomId}/images/${imageId}`;
  }

  public postImage(files: FileList | null, hotelId: number, roomId?: number): Observable<any> {
    const fileToUpload = files?.[0] as File;
    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    let httpUrl = '';
    if (!roomId) {
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

  public getImages(
    hotelId: number,
    pageParameters: PageParameters,
    roomId?: number
    ): Observable<ImagesResponse>{
    const httpParams = pageParameters as Params;
    if (roomId === undefined) {
      return this.http.get<ImagesResponse>(
        `${this.apiUrl}api/hotels/${hotelId}/images`,
        { params: httpParams }
      );
    }
    return this.http.get<ImagesResponse>(
      `${this.apiUrl}api/hotels/${hotelId}/rooms/${roomId}/images`,
      { params: httpParams }
    );
  }

  public deleteImage(hotelId: number, imageId: number, roomId?: number): Observable<string>{
    if (roomId === undefined) {
      return this.http.delete<string>(`${this.apiUrl}api/hotels/${hotelId}/images/${imageId}`);
    }
    return this.http.delete<string>(
      `${this.apiUrl}api/hotels/${hotelId}/rooms/${roomId}/images/${imageId}`
    );
  }
}