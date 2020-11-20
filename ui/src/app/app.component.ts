import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  // Set our map properties
  mapCenter = [-77.4527, 37.5483];
  basemapType = 'streets-vector';
  mapZoomLevel = 11;

  // See app.component.html
  mapLoadedEvent(status: boolean) {
    console.log('The map loaded: ' + status);
  }
}