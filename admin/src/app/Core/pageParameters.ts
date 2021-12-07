import { HttpParams } from '@angular/common/http';
import { PageEvent } from '@angular/material/paginator';

export class PageParameters {
  public constructor(
    public pageSize: number,
    public pageIndex: number = 0
  ) {
  }

  public getHttpParams(): HttpParams {
    const params = new HttpParams()
      .set('pageIndex', this.pageIndex)
      .set('pageSize', this.pageSize);
    return params;
  }

  public updateParameters(event?: PageEvent): void {
    this.pageIndex = event!.pageIndex;
    this.pageSize = event!.pageSize;
  }
}