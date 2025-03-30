import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Inject, ViewChild } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { VideoModel } from "../../store/video.state";
import { debounceTime, fromEvent, map, Subject, takeUntil, tap } from "rxjs";

@Component({
  selector: "app-video-modal",
  templateUrl: "./video-modal.component.html",
  styleUrls: ["./video-modal.component.scss"],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class VideoModalComponent implements AfterViewInit {
  private destroy$: Subject<void> = new Subject<void>();
  public showControls: boolean = false;
  public isPlayed: boolean = false;
  public currentTime: number = 0;

  @ViewChild("videoRef")
  videoRef: ElementRef<HTMLVideoElement>;

  @ViewChild("trackBarRef")
  trackBarRef: ElementRef<HTMLInputElement>;

  constructor(
    public dialogRef: MatDialogRef<VideoModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { video: VideoModel }
  ) {}

  ngAfterViewInit(): void {
    const video = this.videoRef.nativeElement;
    const trackBar = this.trackBarRef.nativeElement;

    trackBar.max = this.data.video.duration.toString();

    fromEvent(video, "timeupdate")
      .pipe(
        map(() => video.currentTime),
        takeUntil(this.destroy$)
      )
      .subscribe(time => {
        this.currentTime = time;
        trackBar.value = time.toString();
        const percentage = (time / this.data.video.duration) * 100;
        trackBar.style.background = `linear-gradient(to right, #FFFFFF ${percentage}%, #FFFFFF4D ${percentage}%)`;
      });

    fromEvent(video, "ended")
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.currentTime = 0;
        trackBar.value = this.currentTime.toString();
        trackBar.style.background = "#FFFFFF4D";
        this.videoRef.nativeElement.pause();
        this.isPlayed = false;
      });

    fromEvent(this.videoRef.nativeElement, "mousemove")
      .pipe(
        tap(() => (this.showControls = true)),
        debounceTime(2000),
        tap(() => (this.showControls = false)),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  onChangeRange(event: Event): void {
    const trackBar = event.target as HTMLInputElement;
    this.videoRef.nativeElement.currentTime = parseFloat(trackBar.value);
  }

  togglePlay(): void {
    this.isPlayed = !this.isPlayed;
    this.videoRef.nativeElement.paused ? this.videoRef.nativeElement.play() : this.videoRef.nativeElement.pause();
  }

  close(): void {
    this.dialogRef.close();
  }
}
