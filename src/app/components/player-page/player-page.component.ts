// angular
import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';

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

  constructor(private _playlistService: PlaylistService,
              private _controlComponent: ControlComponent) {
    this.newPlaylist$ = new EventEmitter<any>();
    this.setGenres();
  }

  public getPlaylist(genre: string): void {
    this.playlist = this._playlistService.getNewPlaylist(genre)
      .subscribe (
        data => {
          this._playlistService.setCurrentPlaylist(data);
          this.setPlaylist(data);
          this._controlComponent.onNewPlaylist(this.playlist);
        },
        error => {
          alert(error);
        }
      );
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
        data => this.genres  = data
      );
  }

  ngOnInit() {

  }
}
