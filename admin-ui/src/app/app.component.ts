import { Component, ViewChild } from '@angular/core';
import { DashboardComponent } from './dashboard/dashboard.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'admin-ui';

  @ViewChild(DashboardComponent) child: DashboardComponent;
  ngAfterViewInit() {
    console.log("ngAfterViewInit"); 
  }
}
