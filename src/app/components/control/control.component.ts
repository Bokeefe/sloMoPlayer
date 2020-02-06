// angular
import {ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';

// libraries
import * as Pizzicato from '../../../../node_modules/pizzicato/distr/Pizzicato.js';

// services
import {PlaylistService} from '../../shared/services/playlist.service';
import { UserAlertService } from './../../shared/services/user-alert.service';

// models
import {EffectsSettings} from '../../shared/models/effects-settings';
import {SettingsService} from '../../shared/services/settings.service';
import {Song} from '../../shared/models/song';

@Component({
  selector: 'app-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.css']
})
export class ControlComponent implements OnChanges, OnDestroy, OnInit {
  @Input() playlist: any;

  public currentSong: any;
  public isPlaying: boolean;
  public isLoading: boolean;
  public audio: any;
  public playlistPosition: number;
  public effectsSettings: EffectsSettings;
  private rootDir: string;

  constructor(private cd: ChangeDetectorRef,
              private _playlistService: PlaylistService,
              private _settingsService: SettingsService,
              private _userAlertService: UserAlertService) {
    this.rootDir = '/music/';
  }
  
  ngOnInit() {
    this.effectsSettings = new EffectsSettings(false, .6, .7, .8);

    this.initEffectsSettings();
    this.setPlaylistPosition();
    this.currentSong = new Song();
    this._settingsService.onSettingsChange$.subscribe(
      data => this.setEffectsSettings(data)
    );
  }

  public onSnail(): void {
    this._userAlertService.message();
  }

  public nextTrackPlay(): void {
    if (!this.audio.paused) {
      this._playlistService.incrementPlaylistPosition();
      this.setPlaylistPosition();

      if (this.playlistPosition < this.playlist.length) {
        setTimeout(() => {
          this.initAudio();
        });
      } else {
        this._userAlertService.message('playlist finished');
      }
    }
  }

  public togglePlay(): void {
    if (this.audio && this.audio.playing) {
      this.audio.pause();
      this.audio.sourceNode.playbackRate.value = this.effectsSettings.speed;
      this.setIsPlaying(false);
    } else if (this.audio && this.audio.paused) {
      this.audio.play();
      this.audio.sourceNode.playbackRate.value = this.effectsSettings.speed;
      this.audio.sourceNode.onended = () => {

        this.nextTrackPlay();
      };
      this.setIsPlaying(true);
    } else if (!this.audio) {
      this._userAlertService.message('🐢 pick a playlist');
    }

  }

  private initAudio(): void {
    this.setIsLoading(true);

    if (this.audio && this.audio.playing) {
      this.audio.stop();
      this.setIsPlaying(false);
      delete this.audio;
    } else if (this.audio && !this.audio.playing) {
      this.setIsPlaying(false);
      delete this.audio;
    }
//
    this.audio = new Pizzicato.Sound(this.rootDir + this.playlist[this.playlistPosition].path, () => {
      const reverb = new Pizzicato.Effects.Reverb({
        time: 5,
        decay: 0.8,
        reverse: false,
        mix: this.effectsSettings.reverbMix
      });

      this.audio.addEffect(reverb);
      this.audio.play();
      this.setCurrentSong();
      this.setIsLoading(false);
      this.setIsPlaying(true);
      this.cd.detectChanges();
      this.audio.sourceNode.playbackRate.value = this.effectsSettings.speed;
      this.audio.volume = this.effectsSettings.volume;
      this.audio.sourceNode.onended = () => {
        this.setIsPlaying(false);
        this.nextTrackPlay();
      };
    });
  }

  private initEffectsSettings(): void {
    const localFX = JSON.parse(localStorage.getItem('effectsSettings'));
    if (!!localFX && localFX.hasOwnProperty('lamronMode')) {
      this.setEffectsSettings(new EffectsSettings(localFX._lamronMode, localFX._reverbMix, localFX._speed, localFX._volume));
    } else {
      this.setEffectsSettings(new EffectsSettings(false, .6, .7, .8));
    }
  }

  private  setCurrentSong(): void {
    if (this.playlist) {
      this.currentSong = {
        title: this.playlist[this.playlistPosition].title || '?',
        artist: this.playlist[this.playlistPosition].artist || ' ?'
      };
      this.cd.detectChanges();
    }
  }

  private setIsLoading(isLoading): void {
    this.isLoading = isLoading;
  }

  private setEffectsSettings(effectsSettings: EffectsSettings): void {
    this.effectsSettings = effectsSettings;
    if (this.audio) {
      this.audio.volume = this.effectsSettings.volume;
      this.audio.sourceNode.playbackRate.value = this.effectsSettings.speed;
      this.audio.effects[0].mix = this.effectsSettings.reverbMix;
    }
  }

  private setIsPlaying(isPlaying): void {
    this.isPlaying = isPlaying;
  }

  private setPlaylistPosition(): void {
    this.playlistPosition = this._playlistService.getPlaylistPosition();
  }

  ngOnDestroy(): void {
    this._settingsService.onSettingsChange$.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.setPlaylistPosition();
    if (changes && !changes.playlist.firstChange && this.playlist.length) {
      this.playlistPosition = 0;
      if (this.audio && this.audio.playing) {
        this.audio.stop();
        delete this.audio;
        setTimeout(() => {
          this.initAudio();
        }, 1000);
      } else {
        this.initAudio();
      }
    }
  }

 
}
