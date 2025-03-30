import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "secondsToVideoTime",
})
export class SecondsToVideoTimePipe implements PipeTransform {
  transform(value: number): string {
    const minutes = Math.floor(value / 60);
    const seconds = Math.floor(value % 60);

    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");

    return `${formattedMinutes}:${formattedSeconds}`;
  }
}
