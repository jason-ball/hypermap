import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ColorScheme } from '../models/ColorScheme.model';
import { WelcomeService } from '../services/welcome.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {

  show: boolean = true;
  show$: Observable<boolean>;
  colorSchemes: ColorScheme[];
  activeColorScheme: ColorScheme;
  activeColorScheme$: Observable<ColorScheme>;

  constructor(private welcomeService: WelcomeService) {
    this.colorSchemes = [
      {
        type: 'default',
        label: 'Normal Color Vision'
      },
      {
        type: 'deutan',
        label: 'Green-Weak/Deuteranomaly'
      },
      {
        type: 'protan',
        label: 'Red-Weak/Protanomaly'
      },
      {
        type: 'tritan',
        label: 'Blue-Weak/Tritanomaly'
      }
    ];
    this.activeColorScheme = this.colorSchemes[0]
  }

  ngOnInit(): void {
    this.show$ = this.welcomeService.show;
    this.show$.subscribe(s => this.show = s);
    this.activeColorScheme$ = this.welcomeService.colorScheme;
    this.activeColorScheme$.subscribe(s => this.activeColorScheme = s);
  }

  openModal() {
    this.welcomeService.openModal();
  }

  closeModal() {
    this.welcomeService.closeModal();
  }

  colorChange({ value }: { value: ColorScheme }) {
    this.welcomeService.setColorScheme(value);
  }

}
