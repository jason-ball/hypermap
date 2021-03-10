import { Injectable } from '@angular/core';
import { Observable, of, Subject, BehaviorSubject } from "rxjs";
import { ColorScheme } from '../models/ColorScheme.model';

@Injectable({
  providedIn: 'root'
})
export class WelcomeService {

  private _show: Subject<boolean> = new BehaviorSubject<boolean>(true);
  public readonly show: Observable<boolean> = this._show.asObservable();
  private _colorScheme: Subject<ColorScheme> = new BehaviorSubject<ColorScheme>({
    type: 'default',
    label: 'Normal Color Vision'
  },);
  public readonly colorScheme: Observable<ColorScheme> = this._colorScheme.asObservable();

  constructor() { }

  openModal() {
    this._show.next(true);
  }

  closeModal() {
    this._show.next(false);
  }

  setColorScheme(colorScheme: ColorScheme) {
    this._colorScheme.next(colorScheme);
  }

}
