import { Component, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-hotels-filter',
  templateUrl: './hotels-filter.component.html',
  styleUrls: ['./hotels-filter.component.css']
})
export class HotelsFilterComponent {
  public message: string = '';
  public progress: number = 0;
  private readonly apiUrl: string;

  @Output() public onUploadFinished = new EventEmitter();

  public constructor(
    private readonly http: HttpClient
  ) {
    this.apiUrl = environment.api;
  }

  public uploadFile = (files: any) => {
    if (files.length === 0)
      return;
    let fileToUpload = <File>files[0];
    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);

    this.http.post(`${this.apiUrl}api/images`, formData, {reportProgress: true, observe: 'events'})
    .subscribe(event => {
      if (event.type === HttpEventType.UploadProgress){
        const total: number = event.total ?? 1; // maybe not
        this.progress = Math.round(100 * event.loaded / total);
      }
      else if(event.type === HttpEventType.Response){
        this.message = 'Upload success!';
        this.onUploadFinished.emit(event.body);
      }
    });
  };
}