import { Component } from '@angular/core';
import { SensorService } from './services/sensor.service';

import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { WelcomeService } from './services/welcome.service';

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
  loading: boolean = true;

  constructor(private sensorService: SensorService, private idle: Idle, private welcomeService: WelcomeService) {
    this.idle.setIdle(4 * 60);
    this.idle.setTimeout(1 * 60);
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    this.welcomeService.show.subscribe(modalOpen => {
      if (modalOpen) {
        this.idle.stop();
        console.log('[HYPERMAP] Session stopped.');
      } else {
        this.idle.watch();
        console.log('[HYPERMAP] Session started.')
      }
    });

    this.idle.onIdleStart.subscribe(() => {
      console.log('[HYPERMAP] User idle. Timeout started!');
    });

    this.idle.onIdleEnd.subscribe(() => {
      console.log('[HYPERMAP] User no longer idle. Timeout stopped.');
    });

    this.idle.onTimeout.subscribe(() => {
      console.log('[HYPERMAP] User timed out. Resetting...');
      this.welcomeService.openModal();
    });
  }
  // See app.component.html
  mapLoadedEvent(status: boolean) {
    console.log('The map loaded: ' + status);
    this.loading = false;
  }

}
