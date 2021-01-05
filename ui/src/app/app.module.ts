import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { MapComponent } from "./map/map.component";
import { HttpClientModule } from '@angular/common/http';
import { ProgressSpinnerModule } from 'primeng/progressspinner';


@NgModule({
  declarations: [AppComponent, MapComponent],
  imports: [BrowserModule, HttpClientModule, ProgressSpinnerModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
