import { Injectable } from "@angular/core";
import { deleteObject, getDownloadURL, getMetadata, listAll, ref, Storage, uploadBytes } from "@angular/fire/storage";
import { Store } from "@ngxs/store";
import { fromPromise } from "rxjs/internal/observable/innerFrom";
import { catchError, combineLatest, Observable, of, switchMap, take, zip } from "rxjs";
import { GetVideos, RemoveVideo, UploadVideo } from "../store/video.actions";
import { VideoModel } from "../store/video.state";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class VideoService {
  constructor(
    private storage: Storage,
    private store: Store,
    private http: HttpClient
  ) {}

  private extractVideoDetails(blob: Blob): Observable<{ poster: string; duration: number }> {
    return new Observable<{ poster: string; duration: number }>(observer => {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.onloadeddata = () => (video.currentTime = video.duration / 2);
      video.onerror = () => observer.error(new Error("Failed to load metadata"));
      video.src = URL.createObjectURL(blob);

      video.onseeked = () => {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(
          blob => {
            observer.next({ poster: URL.createObjectURL(blob), duration: video.duration });
            observer.complete();
          },
          "image/jpeg",
          0.8
        );

        URL.revokeObjectURL(video.src);
      };
    });
  }

  private getVideoDurationAndPoster(url: string): Observable<{ poster: string; duration: number }> {
    return this.http.get(url, { responseType: "blob" }).pipe(
      take(1),
      switchMap(blob => this.extractVideoDetails(blob)),
      catchError(error => {
        throw new Error("Failed to load video: ", error.message);
      })
    );
  }

  getVideos(): void {
    fromPromise(listAll(ref(this.storage, "videos/")))
      .pipe(
        take(1),
        switchMap(list => {
          const observables = list.items.map(item => {
            return zip(getDownloadURL(item), getMetadata(item));
          });

          return zip(...observables);
        }),
        switchMap(responses => {
          const observables = responses.map(response => {
            const [url, metadata] = response;
            return combineLatest([of(url), of(metadata), this.getVideoDurationAndPoster(url)]);
          });

          return zip(...observables);
        })
      )
      .subscribe({
        next: responses => {
          const videoList = responses.map(response => {
            const [url, metadata, { poster, duration }] = response;

            return {
              name: metadata.name,
              url,
              poster,
              createdAt: new Date(metadata.timeCreated),
              duration,
            };
          });

          this.store.dispatch(new GetVideos(videoList));
        },
      });
  }

  uploadVideo(blob: Blob): void {
    const videoName = Date.now();
    const videoRef = ref(this.storage, `videos/${videoName}.webm`);

    fromPromise(uploadBytes(videoRef, blob))
      .pipe(
        take(1),
        switchMap(() => zip(getDownloadURL(videoRef), getMetadata(videoRef))),
        switchMap(responses => {
          const [url, metadata] = responses;
          return combineLatest([of(url), of(metadata), this.getVideoDurationAndPoster(url)]);
        })
      )
      .subscribe({
        next: responses => {
          const [url, metadata, { poster, duration }] = responses;

          const newVideo: VideoModel = {
            name: metadata.name,
            url,
            poster,
            createdAt: new Date(metadata.timeCreated),
            duration,
          };

          this.store.dispatch(new UploadVideo(newVideo));
        },
      });
  }

  removeVideo(videoName: string): void {
    const videoRef = ref(this.storage, `videos/${videoName}`);

    fromPromise(deleteObject(videoRef))
      .pipe(take(1))
      .subscribe({
        next: () => this.store.dispatch(new RemoveVideo(videoName)),
        error: error => console.error(error),
      });
  }
}
