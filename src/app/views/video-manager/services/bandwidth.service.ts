import { Injectable } from "@angular/core";
import { Storage, ref, getDownloadURL } from "@angular/fire/storage";
import { fromPromise } from "rxjs/internal/observable/innerFrom";
import { Observable, switchMap, throwError } from "rxjs";
import { SpeedTestService } from "ng-speed-test";

@Injectable({
  providedIn: "root",
})
export class BandwidthService {
  private size: number = 1129000;

  constructor(
    private storage: Storage,
    private speedTestService: SpeedTestService
  ) {}

  getSpeed(): Observable<number> {
    return this.speedTestService.isOnline().pipe(
      switchMap(result => {
        if (!result) {
          return throwError(() => new Error("No internet connection"));
        } else {
          return fromPromise(getDownloadURL(ref(this.storage, "test-files/1mb.jpg")));
        }
      }),
      switchMap(url => {
        return this.speedTestService.getMbps({
          file: {
            path: url,
            size: this.size,
            shouldBustCache: true,
          },
        });
      })
    );
  }
}
