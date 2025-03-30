import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { Subject, Subscription, switchMap, takeUntil, timer } from "rxjs";
import { RecorderService } from "../../services/recorder.service";
import { BandwidthService } from "../../services/bandwidth.service";
import { fromPromise } from "rxjs/internal/observable/innerFrom";

interface IResolution {
  value: string;
  label: string;
  width: number;
  height: number;
}

@Component({
  selector: "app-recorder",
  templateUrl: "./recorder.component.html",
  styleUrls: ["./recorder.component.scss"],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class RecorderComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  private stream: MediaStream;
  private progressSubscription: Subscription = null;

  public loading: boolean = true;
  public isOpenedSettings: boolean = false;
  public isRecording: boolean = false;
  public progressValue: number = 0;
  public errorMessage: string = "";

  public selectedResolution: string = null;
  public resolutions: IResolution[] = [
    { value: "360p", label: "Low Quality", width: 640, height: 360 },
    { value: "720p", label: "Medium Quality", width: 1280, height: 720 },
    { value: "1080p", label: "High Quality", width: 1920, height: 1080 },
  ];

  @ViewChild("videoRef", { static: true })
  videoRef: ElementRef<HTMLVideoElement>;

  constructor(
    private recorderService: RecorderService,
    private bandwidthService: BandwidthService
  ) {}

  ngOnInit(): void {
    this.bandwidthService
      .getSpeed()
      .pipe(
        switchMap(speed => {
          if (speed < 2) {
            this.selectedResolution = this.resolutions[0].value;
          } else if (speed >= 2 && speed <= 5) {
            this.selectedResolution = this.resolutions[1].value;
          } else {
            this.selectedResolution = this.resolutions[2].value;
          }

          const { width, height } = this.resolutions.find(r => r.value === this.selectedResolution);
          return fromPromise(this.recorderService.getUserMedia({ width, height }));
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: mediaStream => {
          this.stream = mediaStream;
          this.videoRef.nativeElement.srcObject = this.stream;
          this.videoRef.nativeElement.muted = true;
          this.loading = false;
        },
        error: error => {
          this.errorMessage = error.message;
          this.loading = false;
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  selectResolution(value: string): void {
    this.isOpenedSettings = false;
    this.selectedResolution = value;
    const { width, height } = this.resolutions.find(r => r.value === this.selectedResolution);

    this.stream.getVideoTracks().forEach(track => {
      track
        .applyConstraints({ width, height })
        .then(() => console.log("Set resolution: " + this.selectedResolution, track.getConstraints()));
    });
  }

  startRecording(): void {
    this.recorderService.startRecording();
    this.isRecording = true;

    this.progressSubscription = timer(0, 100)
      .pipe(takeUntil(timer(10000)))
      .subscribe(() => {
        this.progressValue += 1;

        if (this.progressValue === 100) {
          this.stopRecording();
        }
      });
  }

  stopRecording(): void {
    this.recorderService.stopRecording(this.progressValue * 100);
    this.isRecording = false;
    this.progressSubscription.unsubscribe();
    this.progressValue = 0;
  }
}
