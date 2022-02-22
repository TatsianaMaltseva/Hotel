import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.css']
})
export class DeleteDialogComponent {
  public isDeletionApproved: boolean = false;
  public constructor(
    @Inject(MAT_DIALOG_DATA) public message: string,
    public dialogRef: MatDialogRef<DeleteDialogComponent>
  ) {
  }

  public approveDeletion(): void {
    this.isDeletionApproved = true;
    this.dialogRef.close();
  }

  public closeDeletionDialog(): void {
    this.dialogRef.close();
  }
}
