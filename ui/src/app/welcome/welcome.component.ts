import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { WelcomeService } from '../services/welcome.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {

  show: boolean = true;
  show$: Observable<boolean>;

  colorblindItems = [
    {
      label: 'Red-Weak/Protanomaly'
    },
    {
      label: 'Green-Weak/Deuteranomaly'
    },
    {
      label: 'Blue-Weak/Tritanomaly'
    }
  ]

  constructor(private welcomeService: WelcomeService) { }

  ngOnInit(): void {
    this.show$ = this.welcomeService.show;
    this.show$.subscribe(s => this.show = s);
  }

  openModal() {
    this.welcomeService.openModal();
  }

  closeModal() {
    this.welcomeService.closeModal();
  }

}
