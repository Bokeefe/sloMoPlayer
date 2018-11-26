// angular
import {Injectable} from '@angular/core';

// libraries
import * as Pizzicato from '../../../../node_modules/pizzicato/distr/Pizzicato.js';

// services
import {HttpClientService} from './http-client.service';
import {PlaylistService} from './playlist.service';

// models
import {EffectsSettings} from '../models/effects-settings';
import {Song} from '../models/song';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  public isPlaying: boolean;

  public effectsSettings: EffectsSettings;

  public pizzi: any;

  public playlist: Array<Song>;

  public playlistArray: Array<string>;

  public playlistPosition: number;

  public rootDir: string;
  constructor(private _http: HttpClientService, private _playlistService: PlaylistService) {
    this.playlistArray = [];

    this.playlistPosition = 0;
    this.effectsSettings = new EffectsSettings(.6, .7, .8);
    this.rootDir = '/music/';
  }

  public getPizzi(): Pizzicato.Sound {
    return this.pizzi;
  }

  public getPlaylistPosition(): number {
    return this.playlistPosition;
  }

  public nextTrack(): void {
    this.playlistPosition++;
    if ( this.playlistPosition < this.playlistArray.length) {
      if (this.pizzi.playing)  {
        this.pizzi.stop();
        delete this.pizzi;
        this.play();
      } else {
        this.play();
      }
    }
  }

  public pause(): void {
    if (this.pizzi) {
      this.setIsPlaying(false);
      this.pizzi.pause();
    }
  }

  public play(): void {
    this.setPlaylist(this.playlist ? this.playlist : this._playlistService.getPlaylist());

    if (this.pizzi) {
      this.pizzi.play(this.playlistArray[this.playlistPosition]);
    } else {
      this.initPizzi(new EffectsSettings(.6, .8, .8), () => {
        setTimeout(() => {
          this.pizzi.play();
          this.setIsPlaying(true);

          if (this.pizzi.hasOwnProperty('sourceNode') && this.pizzi.sourceNode.length) {
            this.pizzi.sourceNode.playbackRate.value = this.effectsSettings.speed;
            this.pizzi.sourceNode.onended = () => {
              setTimeout(() => {
                this.nextTrack();
              }, 5000);
            };
          }
        }, 10000);
      });
    }
  }

  public setEffects(effectsSettings: EffectsSettings): void {
    this.effectsSettings = effectsSettings;
    this.setEffectsOnPizzi();
  }

  public setEffectsOnPizzi(): void {
    if (this.pizzi.volume) {
      this.pizzi.volume = this.effectsSettings.volume * .01;
    }

    if (this.pizzi.effects) {
      this.pizzi.effects[0].mix = this.effectsSettings.reverbMix * .01;
    }

    if (this.pizzi && this.pizzi.hasOwnProperty('sourceNode')) {
      this.pizzi.sourceNode.playbackRate.value = this.effectsSettings.speed * .01;
    }
  }

  public stop (callback: Function): void {
    this.setIsPlaying(false);
    this.pizzi.stop();
    delete this.pizzi;

    callback();
  }

  public toggleReverb(): void {
    if (this.pizzi.hasOwnProperty('effects') && this.pizzi.effects[0].mix === 0) {
      this.setEffects(this.effectsSettings);
    } else if (this.pizzi.hasOwnProperty('effects') && this.pizzi.effects[0].mix !== 0) {
      this.setEffects(new EffectsSettings(0, this.effectsSettings.speed, this.effectsSettings.volume));
    }
  }

  private initPizzi(effectsSettings: EffectsSettings, callback): void {

    const pizzi = new Pizzicato.Sound({
      source: 'file',
      options: {
          path: this.rootDir + this.playlist[this.playlistPosition].path,
          volume: effectsSettings.volume
      }
    }, function() {
      const reverb = new Pizzicato.Effects.Reverb({
          time: 5,
          decay: 0.8,
          reverse: false,
          mix: effectsSettings.reverbMix
      });

      pizzi.addEffect(reverb);
    });

    this.pizzi = pizzi;

    callback();
  }

  private parsePlaylistPaths(): void {
    if (this.playlist) {
      for (let song of this._playlistService.playlist) {
        this.playlistArray.push(this.rootDir + song.path);
      }
    }
  }

  private shiftPlaylist(): void {
    if (this.playlist[0]) {
      this.playlist.shift();
    }
    this._playlistService.setCurrentPlaylist(this.playlist);
    this.parsePlaylistPaths();
  }

  private setIsPlaying(isPlaying: boolean): void {
    this.isPlaying = isPlaying;
  }

  private initPlaylist(): void {
    this.setPlaylist(this._playlistService.playlist);
  }

  private setPlaylist(playlist: Array<Song>): void {
    this.playlist = playlist;
    this.parsePlaylistPaths();
  }

  private setOnEnded(): void {
    this.pizzi.sourceNode.onended = function() {
      this.nextTrack();
    };
    console.log('onended set', this.pizzi.onended);
  }
}
