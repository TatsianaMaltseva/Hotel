import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface Image {
  id: number;
}

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

  public postImage(files: FileList | null, hotelId: number): Observable<any> {
    let fileToUpload = <File>files?.[0];
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
}