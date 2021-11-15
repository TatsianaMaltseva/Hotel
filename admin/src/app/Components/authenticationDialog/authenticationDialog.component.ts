import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-authentication-dialog',
  templateUrl: './authenticationDialog.component.html'
})

export class AuthenticationDialogComponent {
  public get closeAuthDialogGet(): Function {
    return this.closeAuthDialog.bind(this);
  }

  public constructor(
    private readonly matDialogRef: MatDialogRef<AuthenticationDialogComponent>
  ) {
  }

  public closeAuthDialog(): void {
    this.matDialogRef.close();
  }
}