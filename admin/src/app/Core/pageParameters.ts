import { PageEvent } from '@angular/material/paginator';
import { Params } from '@angular/router';

export class PageParameters {
  public constructor(
    public pageSize: number,
    public pageIndex: number = 0
  ) {
  }

  public updateParameters(data: PageEvent | Params): void {
      this.pageIndex = data.pageIndex;
      this.pageSize = data.pageSize;
  }
}