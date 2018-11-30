// angular
import {EventEmitter, Injectable, Output} from '@angular/core';

// libraries
import * as Pizzicato from '../../../../node_modules/pizzicato/distr/Pizzicato.js';

// services
import {HttpClientService} from './http-client.service';
import {PlaylistService} from './playlist.service';

// models
import {EffectsSettings} from '../models/effects-settings';
import {Song} from '../models/song';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  @Output() isPlaying$: EventEmitter<boolean>;
  @Output() isLoading$: EventEmitter<boolean>;
  @Output() currentSong$: EventEmitter<Song>;

  public effectsSettings: EffectsSettings;

  public pizzi: any;

  public playlist: Array<Song>;

  public playlistArray: Array<string>;

  public playlistPosition: number;

  public rootDir: string;

  constructor(private _http: HttpClientService,
              private _playlistService: PlaylistService) {
    this.playlistArray = [];
    this.playlistPosition = 0;
    this.initEventEmitters();
    this.setEffects(new EffectsSettings(.6, .7, .8));
    this.rootDir = '/music/';
  }

  public getPizzi(): Pizzicato.Sound {
    return this.pizzi;
  }

  public getPlaylistPosition(): number {
    return this.playlistPosition;
  }

  public nextTrack(): void {
    this.isLoading$.emit(true);
    this.playlistPosition++;

    if (this.playlistPosition <= this.playlistArray.length) {
      setTimeout(() => {
        if (this.pizzi.playing) {
          this.pizzi.stop();
          this.isPlaying$.emit(false);
          delete this.pizzi;
          this.play();
          this.isPlaying$.emit(true);

        } else {
          this.isPlaying$.emit(false);
        }
      }, 5000);
    } else {
      this.pizzi.stop();
      this.isPlaying$.emit(false);

    }
  }

  public pause(): void {
    if (this.pizzi) {
      this.pizzi.pause();
      this.isPlaying$.emit(false);

    }
  }

  public play(): void {

    this.setPlaylist(this._playlistService.getPlaylist());

    if (this.pizzi) {
      this.pizzi.play(this.playlistArray[this.playlistPosition]);
      this.currentSong$.emit(this.playlist[this.playlistPosition]);
      this.isLoading$.emit(false);
      this.isPlaying$.emit(true);
    } else {
        this.initPizzi(this.effectsSettings, () => {
          setTimeout(() => {
            this.pizzi.sourceNode.onended = () => {
              this.nextTrack();
            };
          }, 5000);
      });
    }
  }

  public setEffects(effectsSettings: EffectsSettings): void {
    this.effectsSettings = effectsSettings;
    this.setEffectSettingsLocalStorage();
    if (this.pizzi) {
      this.setEffectsOnPizzi();
    }
  }

  public setEffectsOnPizzi(): void {
    if (this.pizzi.volume) {
      this.pizzi.volume = this.effectsSettings.volume;
    }

    if (this.pizzi.effects) {
      this.pizzi.effects[0].mix = this.effectsSettings.reverbMix;
    }

    if (this.pizzi && this.pizzi.hasOwnProperty('sourceNode')) {
      this.pizzi.sourceNode.playbackRate.value = this.effectsSettings.speed;
    }
  }

  public stop(callback: Function): void {
    if (this.pizzi) {
      this.pizzi.stop();
      this.isPlaying$.emit(false);

      delete this.pizzi;
    }
    callback();
  }

  public toggleReverb(): void {
    if (this.pizzi.hasOwnProperty('effects') && this.pizzi.effects[0].mix === 0) {
      this.setEffects(this.effectsSettings);
    } else if (this.pizzi.hasOwnProperty('effects') && this.pizzi.effects[0].mix !== 0) {
      this.setEffects(new EffectsSettings(0, this.effectsSettings.speed, this.effectsSettings.volume));
    }
  }

  private initPizzi(effectsSettings: EffectsSettings, callback?: Function): void {
    if (this.pizzi) {
      delete this.pizzi;
    }

    const pizzi = new Pizzicato.Sound({
      source: 'file',
      options: {
        path: this.rootDir + this.playlist[this.playlistPosition].path,
        volume: effectsSettings.volume
      }
    }, function () {
      const reverb = new Pizzicato.Effects.Reverb({
        time: 5,
        decay: 0.8,
        reverse: false,
        mix: effectsSettings.reverbMix
      });
      pizzi.addEffect(reverb);
      pizzi.play();

      pizzi.sourceNode.playbackRate.value = effectsSettings.speed;
    });
    this.pizzi = pizzi;
    this.currentSong$.emit(this.playlist[this.playlistPosition]);
    this.isPlaying$.emit(true);
    this.isLoading$.emit(false);

    callback();
  }

  private initEventEmitters(): void {
    this.isPlaying$ = new EventEmitter<boolean>();
    this.isLoading$ = new EventEmitter<boolean>();
    this.currentSong$ = new EventEmitter<Song>();

  }

  private parsePlaylistPaths(): void {
    this.playlistArray = [];
    if (this.playlist) {
      for (let song of this._playlistService.playlist) {
        this.playlistArray.push(this.rootDir + song.path);
      }
    }
  }

  private setEffectSettingsLocalStorage (): void {
    localStorage.setItem('effectsSettings', JSON.stringify(this.effectsSettings));
  }

  private setPlaylist(playlist: Array<Song>): void {
    this.playlist = [];
    this.playlist = playlist;
    this.parsePlaylistPaths();
  }
}
