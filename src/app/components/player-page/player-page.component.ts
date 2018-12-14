// angular
import {Component, EventEmitter, OnInit, Output} from '@angular/core';

// services
import {PlaylistService} from '../../shared/services/playlist.service';
import { UserAlertService } from './../../shared/services/user-alert.service';

// models
import {Song} from '../../shared/models/song';
import {Subscription} from 'rxjs';
import {AudioService} from '../../shared/services/audio.service';

@Component({
  selector: 'app-player-page',
  templateUrl: './player-page.component.html',
  styleUrls: ['./player-page.component.css']
})
export class PlayerPageComponent implements OnInit {
  @Output() newPlaylist$: EventEmitter<any>;

  public playlist: Array<Song>;

  public playlistPosition: number;

  public genres: any;

  public playlistPositionSub: Subscription;

  constructor(private _audioService: AudioService,
              private _playlistService: PlaylistService,
              private _userAlertService: UserAlertService) {
    this.newPlaylist$ = new EventEmitter<any>();
    this.playlistPosition = 0;
    this.setGenres();
    this.playlistPositionSub = this._playlistService.newPlaylistPosition$.subscribe(
      data => this.setPlaylistPosition()
    );
  }

  public getPlaylist(genre: string): void {
    this.playlist = this._playlistService.getNewPlaylist(genre)
      .subscribe (
        data => {
          this._playlistService.setCurrentPlaylist(data);
          this.setPlaylist(data);
        },
        error => this._userAlertService.error(error)
      );
  }

  public setPlaylist(playlist: Array<Song>): void {
    this.playlist = playlist;
  }

  public setPlaylistPosition(): void {
    this.playlistPosition = this._playlistService.getPlaylistPosition();
  }

  private setDefaultPlaylist(genre: string): void {
    if (this.genres.indexOf(genre) !== -1) {
      this.getPlaylist(genre);
    }
  }

  private setGenres(): void {
    this._playlistService.getGenres()
      .subscribe(
        data => {
          this.genres = data;
        }
      );
  }

  ngOnInit() {
  }
}
