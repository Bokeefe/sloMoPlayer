// angular
import {Component, Input, OnInit} from '@angular/core';

// vendor
import * as Pizzicato from '../../../../node_modules/pizzicato/distr/Pizzicato.js';

// services
import {AudioService} from '../../shared/services/audio.service';
import {PlaylistService} from '../../shared/services/playlist.service';

// models
import {Settings} from '../../shared/models/settings';

@Component({
  selector: 'app-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.css']
})
export class ControlComponent implements OnInit {
  @Input() playlist: any;

  public isPlaying: boolean;

  public playerLoading: Boolean;

  public pizzi: any;

  constructor(private _audioService: AudioService,
              private _playlistService: PlaylistService) {
  }

  public nextTrackPlay(): void {

  }

  public onNewPlaylist(event: any): void {
  }

  public onSettingsCallback(effectsParams: any): void {
  }

  public toggleReverb(): void {

  }

  public togglePlay(): void {

    this.isPlaying = !this.isPlaying;

    this._audioService.play(new Settings(.6, .8, .8));
  }

  private playFile(): void {

  }

  private pauseFile(): void {
    this.togglePlayClass();
  }


  private setPlaylist(playlist: any): void {
    this.playlist = playlist;
  }


  private togglePlayClass(): void {

    console.log(this._audioService.pizzi);
    // this.isPlaying = this._audioService.pizzi.isPlaying
  }

  ngOnInit() {
  }
}
