import { MatSnackBar } from '@angular/material';
// angular
import {Component} from '@angular/core';

// libraries

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
  constructor(public _snackBar: MatSnackBar) {}

  public openSnackBar(message) {
    this._snackBar.open(message, 'OKAY', {
      duration: 5000,
    });
  }

}
