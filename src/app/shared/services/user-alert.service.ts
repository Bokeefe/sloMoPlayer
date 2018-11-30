import { Injectable, Output, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserAlertService {
  @Output() message$: EventEmitter<string>;

  constructor() {
    this.initEventEmitters();
   }

  public message(message: string): void {
    this.message$.emit(message);
  }

  public error(error: any): void {
    console.log(error);
    this.message$.emit(error.message);
  }

  private initEventEmitters(): void {
    this.message$ = new EventEmitter<string>();
  }
}
