// angular
import {Component, Input, OnInit} from '@angular/core';

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

  public isLoading: boolean;

  public pizzi: any;

  public effectsSettings: EffectsSettings;

  constructor(private _audioService: AudioService,
              private _playlistService: PlaylistService) {
        this.effectsSettings = new EffectsSettings(.6, .8, .8);
        this.setIsPlaying(false);
  }

  public nextTrackPlay(): void {
    this._audioService.nextTrack();
  }

  public onSettingsCallback(effectsParams: any): void {
    this.setEffectsSettings(effectsParams);
  }

  public togglePlay(): void {
    if (this._audioService.hasOwnProperty('pizzi') && this._audioService.pizzi.playing) {
      this._audioService.pause();
      this.setIsPlaying(true);
    } else {
      this._audioService.play();
      const test = this._audioService.getPizzi();
      console.log(test.sourceNode.context.currentTime);
      this.setIsPlaying(true);
    }
  }

  private setEffectsSettings(effectsSettings: EffectsSettings): void {
    this.effectsSettings = effectsSettings;
  }

  private setIsPlaying(isPlaying): void {
    this.isPlaying = isPlaying;
  }

  ngOnInit() {
  }
}
