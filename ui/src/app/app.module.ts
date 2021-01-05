import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { MapComponent } from "./map/map.component";
import { HttpClientModule } from '@angular/common/http';
import { WelcomeComponent } from './welcome/welcome.component';

import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DialogModule } from "primeng/dialog";
import { ButtonModule } from "primeng/button";
import { SharedModule } from "primeng/api";
import { MenuModule } from "primeng/menu";

import { NgIdleKeepaliveModule } from "@ng-idle/keepalive";


@NgModule({
  declarations: [AppComponent, MapComponent, WelcomeComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    DialogModule,
    ButtonModule,
    SharedModule,
    MenuModule,
    ProgressSpinnerModule,
    NgIdleKeepaliveModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
