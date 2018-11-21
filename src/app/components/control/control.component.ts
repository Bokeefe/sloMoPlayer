// angular
import {Component, Input, OnInit} from '@angular/core';

// vendor
import * as Pizzicato from '../../../../node_modules/pizzicato/distr/Pizzicato.js';

// services
import {AudioService} from '../../shared/services/audio.service';
import {PlaylistService} from '../../shared/services/playlist.service';

// models
import {EffectsSettings} from '../../shared/models/effects-settings';

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

  public effectsSettings: EffectsSettings;

  constructor(private _audioService: AudioService,
              private _playlistService: PlaylistService) {
        this.effectsSettings = new EffectsSettings(.6, .8, .8);
  }

  public nextTrackPlay(): void {
    this._audioService.nextTrack();
  }

  public onNewPlaylist(event: any): void {
  }

  public onSettingsCallback(effectsParams: any): void {
    this.setEffectsSettings(effectsParams);
  }

  public onToggleReverb() {
    this._audioService.toggleReverb();
  }

  public togglePlay(): void {
    if (this._audioService.hasOwnProperty('pizzi') && this._audioService.pizzi.playing) {
      this._audioService.pause();
    } else {
      this._audioService.play();
      this.setIsPlaying();
    }
  }

  private setEffectsSettings(effectsSettings: EffectsSettings): void {
    this.effectsSettings = effectsSettings;
  }

  private setIsPlaying(): void {
    this.isPlaying = !this.isPlaying;
  }

  ngOnInit() {
  }
}
