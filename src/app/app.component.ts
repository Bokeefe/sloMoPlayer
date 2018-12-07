import { UserAlertService } from './shared/services/user-alert.service';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material';
// angular
import { Component } from '@angular/core';
import {InfoComponent} from './components/info/info.component';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  public userErrorSub: Subscription;
  public userMessageSub: Subscription;
  public infoSub: Subscription;

  constructor(public _snackBar: MatSnackBar,
              private _userAlertService: UserAlertService) {
    this.userMessageSub = this._userAlertService.message$.subscribe(
      data => this.openMessageSnackBar(data)
    );
    this.userErrorSub = this._userAlertService.error$.subscribe(
      data => this.openErrorSnackBar(data)
    );
  }

  public openErrorSnackBar(message: string) {
    this._snackBar.open(message, null, {
      duration: 2000,
      panelClass: 'error-dialog'
    });
  }

  public openMessageSnackBar(message: string) {
    this._snackBar.openFromComponent(InfoComponent, {
      data: message,
      panelClass: 'info-dialog'
    });
  }
}
