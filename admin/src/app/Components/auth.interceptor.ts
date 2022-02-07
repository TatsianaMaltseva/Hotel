import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthenticationDialogComponent } from './authenticationDialog/authenticationDialog.component';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  public constructor(
    private readonly matDialog: MatDialog
  ) {
  }

  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request)
      .pipe(
        catchError((response: HttpErrorResponse) => {
          if (response.status === 401) {
            this.openLoginDialog();
          }
          return throwError(response);
        })
      );
  }

  public openLoginDialog(): void {
    this.matDialog.open(
      AuthenticationDialogComponent,
      {
        width: '400px'
      }
    );
  }
}
