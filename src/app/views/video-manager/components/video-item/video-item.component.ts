import { ChangeDetectionStrategy, Component, Input, OnDestroy } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { VideoModalComponent } from "../../modals/video-modal/video-modal.component";
import { VideoModel } from "../../store/video.state";
import { DeleteVideoModalComponent } from "../../modals/delete-video-modal/delete-video-modal.component";
import { filter, Subject, takeUntil } from "rxjs";
import { VideoService } from "../../services/video.service";

@Component({
  selector: "app-video-item",
  templateUrl: "./video-item.component.html",
  styleUrls: ["./video-item.component.scss"],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class VideoItemComponent implements OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  public showDeleteIcon: boolean = false;

  @Input()
  video: VideoModel;

  constructor(
    public dialog: MatDialog,
    private videoService: VideoService
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openVideoModal(): void {
    this.dialog
      .open(VideoModalComponent, { disableClose: true, data: { video: this.video }, panelClass: "open-video-dialog" })
      .afterClosed()
      .pipe(takeUntil(this.destroy$));
  }

  deleteVideo(event: Event): void {
    event.stopPropagation();

    this.dialog
      .open(DeleteVideoModalComponent, { disableClose: true, panelClass: "delete-video-dialog" })
      .afterClosed()
      .pipe(
        filter(result => result),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: () => this.videoService.removeVideo(this.video.name),
      });
  }
}
