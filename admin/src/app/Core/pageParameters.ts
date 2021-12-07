import { HttpParams } from '@angular/common/http';

export class PageParameters {
  public constructor(
    public pageSize: number,
    public pageIndex: number = 0
  ) {
  }

  public getHttpParams(): HttpParams{
    let params = new HttpParams()
      .set('pageIndex', this.pageIndex)
      .set('pageSize', this.pageSize);
    return params;
  }

  public getHttpParamsObj(): object{
    let params = {
      'pageIndex': this.pageIndex,
      'pageSize': this.pageSize
    };
    return params;
  }
}