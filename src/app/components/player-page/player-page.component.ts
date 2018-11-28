// angular
import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {MatSnackBar} from '@angular/material';

// services
import {PlaylistService} from '../../shared/services/playlist.service';

// components
import {ControlComponent} from '../control/control.component';

// models
import {Song} from '../../shared/models/song';

@Component({
  selector: 'app-player-page',
  templateUrl: './player-page.component.html',
  styleUrls: ['./player-page.component.css']
})
export class PlayerPageComponent implements OnInit {
  @Output() newPlaylist$: EventEmitter<any>;

  public playlist: Array<Song>;

  public genres: any;

  constructor(public _snackBar: MatSnackBar,
              private _playlistService: PlaylistService,
              private _controlComponent: ControlComponent) {
    this.newPlaylist$ = new EventEmitter<any>();
    this.setGenres();
  }

  public getPlaylist(genre: string): void {
    this.playlist = this._playlistService.getNewPlaylist(genre)
      .subscribe (
        data => {
          console.log(data);
          this._playlistService.setCurrentPlaylist(data);
          this.setPlaylist(data);
        },
        error => {
          console.log('error', error);
        }
      );
  }
  public openSnackBar(error) {
    this._snackBar.open('lorem', 'OKAY', {
      duration: 5000,
    });
  }

  public onSelect(song: any): void {
    console.log(song);
  }

  public setPlaylist(playlist: Array<Song>): void {
    this.playlist = playlist;
  }

  private setGenres(): void {
    this._playlistService.getGenres()
      .subscribe(
        data => this.genres = data
      );
  }

  ngOnInit() {
    this.getPlaylist('Christmas');
  }
}
