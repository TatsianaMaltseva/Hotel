import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError } from 'rxjs/operators';

@Injectable()
export class BadRequestInterceptor implements HttpInterceptor {

  public constructor(
    private readonly snackBar: MatSnackBar
  ) {
  }

  public intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request)
    .pipe(
      catchError((response: HttpErrorResponse) => {
        if (response.status === 400 || response.status === 404 ) {
          this.openSnackBar(response.error as string);
        }
        return throwError(response);
      })
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
}
