import { UserAlertService } from './shared/services/user-alert.service';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material';
// angular
import { Component } from '@angular/core';

// services
import { PlaylistService } from './shared/services/playlist.service';

// models
import { Song } from './shared/models/song';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  public userAlertSub: Subscription;

  constructor(public _snackBar: MatSnackBar,
              private _userAlertService: UserAlertService) {
    this.userAlertSub = this._userAlertService.message$.subscribe(
      data => this.openSnackBar(data)
    );
  }

  public openSnackBar(message: string) {
    this._snackBar.open(message, 'OKAY',  {

    });
  }
}
