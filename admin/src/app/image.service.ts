import { Injectable } from '@angular/core';

export interface Image {
  id: number;
  image: File;
}

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  
}