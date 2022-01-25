import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateService {
  public checkInDate: string = '';
  public checkOutDate: string = '';

  public updateDateParams(checkInDate: string, checkOutDate: string): void {
    this.checkInDate = checkInDate;
    this.checkOutDate = checkOutDate;
  }
}
