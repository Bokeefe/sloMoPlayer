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
  constructor(private _playlistService: PlaylistService) {}

  public pizzi: any;

  public playlist: Array<Song>;

  public initPizzi(): void {
    const playlist = this._playlistService.getPlaylist();
    const dir = './dist/assets/music/';
    console.log(dir + playlist[0].path);

    this.pizzi = new Audio(dir + playlist[0].path);
    this.pizzi.load();
    this.pizzi.play();

    // if (this.pizzi) {
    //   delete this.pizzi;
    // }

    // this.pizzi = new Pizzicato.Sound({
    //   source: 'file',
    //   options: { path:  dir + playlist[0].path }
    // }, function() {
    //     console.log('initialized', dir + playlist[0].path, this.pizzi);
    // });
  }

}
