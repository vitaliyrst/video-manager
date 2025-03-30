import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  {
    path: "",
    redirectTo: "video-manager",
    pathMatch: "full",
  },
  {
    path: "video-manager",
    loadChildren: () => import("./views/video-manager/video-manager.module").then(m => m.VideoManagerModule),
  },
  {
    path: "**",
    redirectTo: "video-manager",
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
