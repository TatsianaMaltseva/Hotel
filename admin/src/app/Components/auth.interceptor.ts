import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';

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
            this.login();
          }
          return throwError(response);
        })
      );
  }

  public login(): void {
    this.matDialog.open(
      AuthenticationDialogComponent,
      {
        width: '400px'
      }
    );
  }
}
