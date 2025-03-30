import { NgModule } from "@angular/core";
import { CommonModule, NgOptimizedImage } from "@angular/common";
import { VideoManagerComponent } from "./video-manager.component";
import { RouterModule, Routes } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { VideoItemComponent } from "./components/video-item/video-item.component";
import { VideoModalComponent } from "./modals/video-modal/video-modal.component";
import { RecorderComponent } from "./components/recorder/recorder.component";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { DeleteVideoModalComponent } from "./modals/delete-video-modal/delete-video-modal.component";
import { SecondsToVideoTimePipe } from "../../shared/pipes/seconds-to-video-time.pipe";
import { MatDialogModule } from "@angular/material/dialog";

const routes: Routes = [{ path: "", component: VideoManagerComponent }];

@NgModule({
  declarations: [
    VideoManagerComponent,
    VideoItemComponent,
    VideoModalComponent,
    RecorderComponent,
    DeleteVideoModalComponent,
    SecondsToVideoTimePipe,
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FormsModule,
    NgOptimizedImage,
    MatProgressBarModule,
    MatDialogModule,
  ],
})
export class VideoManagerModule {}
