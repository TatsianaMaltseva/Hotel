import * as dayjs from 'dayjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateService {
  public checkInDate: string = '';
  public checkOutDate: string = '';
  private readonly format = 'YYYY-MM-DD';

  public updateDateParams(checkInValue: string, checkOutValue: string): void {
    this.checkInDate = dayjs(new Date(checkInValue)).format(this.format);
    this.checkOutDate = dayjs(new Date(checkOutValue)).format(this.format);
  }
}
