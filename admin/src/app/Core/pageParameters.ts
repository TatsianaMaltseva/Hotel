import { HttpParams } from '@angular/common/http';
import { PageEvent } from '@angular/material/paginator';
import { Params } from '@angular/router';

export class PageParameters {
  public constructor(
    public pageSize: number,
    public pageIndex: number = 0
  ) {
  }

  public getHttpParams(): HttpParams{
    const params = new HttpParams()
      .set('pageIndex', this.pageIndex)
      .set('pageSize', this.pageSize);
    return params;
  }

  public getHttpParamsObj(): object{
    const params = {
      'pageIndex': this.pageIndex,
      'pageSize': this.pageSize
    };
    return params;
  }

  public updateParameters(data: PageEvent | Params): void {
    if (data.pageIndex && data.pageSize) {
      this.pageIndex = data.pageIndex;
      this.pageSize = data.pageSize;
    }
  }
}