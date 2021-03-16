import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";


import { AppComponent } from "./app.component";
import { MapComponent } from "./map/map.component";
import { HttpClientModule } from '@angular/common/http';
import { WelcomeComponent } from './welcome/welcome.component';

import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DialogModule } from "primeng/dialog";
import { ButtonModule } from "primeng/button";
import { SharedModule } from "primeng/api";
import { MenuModule } from "primeng/menu";
import { DropdownModule } from 'primeng/dropdown';

import { NgIdleKeepaliveModule } from "@ng-idle/keepalive";
import { DetailsModalComponent } from './details-modal/details-modal.component';


@NgModule({
  declarations: [AppComponent, MapComponent, WelcomeComponent, DetailsModalComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    DialogModule,
    ButtonModule,
    SharedModule,
    MenuModule,
    ProgressSpinnerModule,
    DropdownModule,
    NgIdleKeepaliveModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
