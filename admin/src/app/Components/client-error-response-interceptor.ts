import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpStatusCode
} from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthenticationDialogComponent } from './authenticationDialog/authenticationDialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class ClientErrorResponseInterceptor implements HttpInterceptor {
  public constructor(
    private readonly matDialog: MatDialog,
    private readonly snackBar: MatSnackBar
  ) {
  }

  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request)
      .pipe(
        catchError(
          (response: HttpErrorResponse) => {
            if (response.status === HttpStatusCode.BadRequest || response.status === HttpStatusCode.NotFound) {
              this.openSnackBar(response.error as string);
            }
            if (response.status === HttpStatusCode.Unauthorized) {
              this.openLoginDialog();
            }
            return throwError(response);
          }
        )
      );
  }

  private openSnackBar(message: string): void {
    this.snackBar.open(
      `${message}`,
      'Close',
      {
        duration: 5000
      }
    );
  }

  private openLoginDialog(): void {
    this.matDialog.open(
      AuthenticationDialogComponent,
      {
        width: '400px'
      }
    );
  }
}
