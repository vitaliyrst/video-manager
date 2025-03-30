import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { NgxsModule } from "@ngxs/store";
import { NgxsReduxDevtoolsPluginModule } from "@ngxs/devtools-plugin";
import { NgxsLoggerPluginModule } from "@ngxs/logger-plugin";
import { environment } from "../environments/environment";
import { initializeApp, provideFirebaseApp } from "@angular/fire/app";
import { getStorage, provideStorage } from "@angular/fire/storage";
import { HttpClientModule } from "@angular/common/http";
import { getFirestore, provideFirestore } from "@angular/fire/firestore";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { SpeedTestModule } from "ng-speed-test";
import { VideoState } from "./views/video-manager/store/video.state";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SpeedTestModule,
    provideFirebaseApp(() => initializeApp(environment.fireBaseConfig)),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    NgxsModule.forRoot([VideoState]),
    !environment.production ? NgxsReduxDevtoolsPluginModule.forRoot() : [],
    !environment.production ? NgxsLoggerPluginModule : [],
  ],
  providers: [],
  bootstrap: [AppComponent],
  exports: [],
})
export class AppModule {}
