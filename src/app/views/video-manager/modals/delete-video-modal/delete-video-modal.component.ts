import { ChangeDetectionStrategy, Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-delete-video-modal",
  templateUrl: "./delete-video-modal.component.html",
  styleUrls: ["./delete-video-modal.component.scss"],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class DeleteVideoModalComponent {
  constructor(
    private dialogRef: MatDialogRef<DeleteVideoModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { videoUrl: string }
  ) {}

  close(result: boolean): void {
    this.dialogRef.close(result);
  }
}
