import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from "@angular/core";
import { Observable, Subject, takeUntil } from "rxjs";
import { Select } from "@ngxs/store";
import { VideoService } from "./services/video.service";
import { VideoModel, VideoState } from "./store/video.state";

@Component({
  selector: "app-video-manager",
  templateUrl: "./video-manager.component.html",
  styleUrls: ["./video-manager.component.scss"],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class VideoManagerComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  public videos: VideoModel[] = [];

  @Select(VideoState.videos)
  videos$: Observable<VideoModel[]>;

  constructor(private videoService: VideoService) {}

  ngOnInit(): void {
    this.videoService.getVideos();
    this.videos$.pipe(takeUntil(this.destroy$)).subscribe({
      next: videos => (this.videos = videos),
      error: error => console.log(error),
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
