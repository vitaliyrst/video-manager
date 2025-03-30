import { Injectable } from "@angular/core";
import { VideoService } from "./video.service";
import { fixWebmDuration } from "@fix-webm-duration/fix";

@Injectable({
  providedIn: "root",
})
export class RecorderService {
  private stream: MediaStream = null;
  private mediaRecorder: MediaRecorder = null;
  private recordedChunks: Blob[] = [];

  constructor(private videoService: VideoService) {}

  async getUserMedia(resolution: { width: number; height: number }) {
    this.stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: resolution.width },
        height: { ideal: resolution.height },
        facingMode: "user",
      },
      audio: true,
    });

    return this.stream;
  }

  startRecording(): void {
    if (this.mediaRecorder) {
      this.mediaRecorder.ondataavailable = null;
      this.mediaRecorder.onstop = null;
    }

    this.recordedChunks = [];
    this.mediaRecorder = new MediaRecorder(this.stream, { mimeType: "video/webm; codecs=vp9" });
    this.mediaRecorder.ondataavailable = event => this.recordedChunks.push(event.data);
    this.mediaRecorder.start();
  }

  stopRecording(duration: number): void {
    this.mediaRecorder.onstop = async () => {
      const blob = new Blob(this.recordedChunks, { type: "video/webm" });
      const fixedBlob = await fixWebmDuration(blob, duration);
      this.videoService.uploadVideo(fixedBlob);
    };

    this.mediaRecorder.stop();
  }
}
