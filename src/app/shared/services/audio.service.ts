import { EffectsSettings } from '../models/effects-settings';
import { HttpClientService } from './http-client.service';
// angular
import {Injectable} from '@angular/core';

// libraries
import * as Pizzicato from '../../../../node_modules/pizzicato/distr/Pizzicato.js';

// services
import {PlaylistService} from './playlist.service';

// models
import {Song} from '../models/song';

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  public isPlaying: boolean;

  public pizzi: any;

  public playlist: Array<Song>;

  public playlistArray: Array<string>;

  public playlistPosition: number;

  public rootDir: string;
  constructor(private _http: HttpClientService, private _playlistService: PlaylistService) {
    this.playlistArray = [];
    this.playlistPosition = 0;
    this.rootDir = '/music/';
  }

  public nextTrack(): void {
    this.playlistPosition++;
    if (this.pizzi.playing)  {
      this.pizzi.stop();
      delete this.pizzi;
    }

    setTimeout(() => {
      this.play();
    }, 5000);
  }

  public pause(): void {
    if (this.pizzi) {
      this.setIsPlaying(false);
      this.pizzi.pause();
    }
  }

  public play(effectsSettings?: EffectsSettings): void {
    this.setPlaylist(this.playlist ? this.playlist : this._playlistService.getPlaylist());

    if (this.pizzi) {
      this.pizzi.play(this.playlistArray, () => {
        this.pizzi.sourceNode.onended = () => {
          this.nextTrack();
        };
      });
    } else {
      this.initPizzi(new EffectsSettings(.6, .8, .8));
    }
  }

  public setEffects(effectsSettings: EffectsSettings): void {
    if (this.pizzi.volume) {
      this.pizzi.volume = effectsSettings.volume * .01;
    }
    if (this.pizzi.effects) {
      this.pizzi.effects[0].mix = effectsSettings.reverbMix * .01;
    }
    if (this.pizzi && this.pizzi.hasOwnProperty('sourceNode')) {
      this.pizzi.sourceNode.playbackRate.value = effectsSettings.speed * .01;
    }
  }

  private initPizzi(effectsSettings: EffectsSettings): void {
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

      pizzi.play(() => {
        this.setIsPlaying(true);
        pizzi.sourceNode.playbackRate.value = effectsSettings.speed;
        pizzi.sourceNode.onended = () => {
          this.nextTrack();
        };
      });
    });

    this.pizzi = pizzi;
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
  }
}
