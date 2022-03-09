import { Injectable } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Params } from '@angular/router';
import { PageParameters } from './Core/page-parameters';

@Injectable({
  providedIn: 'root'
})
export class PageParametersService {
  public pageSize: number = 2;
  public pageIndex: number = 0;

  public get pageParameters(): PageParameters {
    return {
      pageSize: this.pageSize,
      pageIndex: this.pageIndex
    } as PageParameters;
  }

  public updateParameters(data: PageEvent | Params): void {
      this.pageIndex = data.pageIndex;
      this.pageSize = data.pageSize;
  }
}
