import { Injectable } from '@angular/core';
import { Observable, of, Subject, BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class WelcomeService {

  private _show: Subject<boolean> = new BehaviorSubject<boolean>(true);
  public readonly show: Observable<boolean> = this._show.asObservable();

  constructor() { }

  openModal() {
    this._show.next(true);
  }

  closeModal() {
    this._show.next(false);
  }

}
