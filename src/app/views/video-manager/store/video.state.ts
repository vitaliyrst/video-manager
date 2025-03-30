import { State, Action, StateContext, Selector } from "@ngxs/store";
import { Injectable } from "@angular/core";
import { RemoveVideo, GetVideos, UploadVideo } from "./video.actions";

export interface VideoModel {
  name: string;
  url: string;
  poster: string;
  createdAt: Date;
  duration: number;
}

export interface VideoStateModel {
  videos: VideoModel[];
}

@State<VideoStateModel>({
  name: "videos",
  defaults: {
    videos: [],
  },
})
@Injectable()
export class VideoState {
  @Selector()
  static videos(state: VideoStateModel): VideoModel[] {
    return state.videos.reverse();
  }

  @Action(GetVideos)
  getVideos(ctx: StateContext<VideoStateModel>, action: GetVideos) {
    ctx.patchState({ videos: action.videos });
  }

  @Action(UploadVideo)
  addVideo(ctx: StateContext<VideoStateModel>, action: UploadVideo) {
    const state = ctx.getState();
    ctx.patchState({ videos: [...state.videos, action.video] });
  }

  @Action(RemoveVideo)
  removeVideo(ctx: StateContext<VideoStateModel>, action: RemoveVideo) {
    const state = ctx.getState();
    ctx.patchState({ videos: state.videos.filter(video => video.name !== action.name) });
  }
}
