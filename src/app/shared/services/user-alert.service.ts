import { Injectable, Output, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserAlertService {
  @Output() message$: EventEmitter<string>;
  @Output() error$: EventEmitter<string>;

  constructor() {
    this.initEventEmitters();
   }

  public message(message?: string): void {
    this.message$.emit(message);
  }

  public error(error: any): void {
    console.log(error);
    this.error$.emit(error.message);
  }

  private initEventEmitters(): void {
    this.error$ = new EventEmitter<string>();
    this.message$ = new EventEmitter<string>();
  }
}
