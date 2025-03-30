import { VideoModel } from "./video.state";

export class GetVideos {
  static readonly type = "[Video] Get";
  constructor(public videos: VideoModel[]) {}
}

export class UploadVideo {
  static readonly type = "[Video] Upload";
  constructor(public video: VideoModel) {}
}

export class RemoveVideo {
  static readonly type = "[Video] Remove";
  constructor(public name: string) {}
}
