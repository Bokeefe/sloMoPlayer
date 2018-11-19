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

  public pizzi: any;

  public playlist: Array<Song>;

  public playlistArray: Array<string>;

  public rootDir: string;
  constructor(private _http: HttpClientService, private _playlistService: PlaylistService) {
    this.setPlaylist();
    this.playlistArray = [];
    this.rootDir = '/music/';
  }

  public getAudio(id: number): void {
  }

  public nextTrack(): void {
    if (this.pizzi.playing)  {
      this.pizzi.pause();
      delete this.pizzi;
    }

    if (this.playlist[0]) {
      this.playlist.shift();
    }

    this.play();
  }

  public pause(): void {
    if (this.pizzi) {
      this.pizzi.pause();
    }
  }

  public play(effectsSettings?: EffectsSettings): void {
    this.setPlaylist();

    if (this.pizzi) {
      delete this.pizzi;
    }

    const pizzi = new Pizzicato.Sound({
        source: 'file',
        options: {
            path: this.playlistArray,
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

        pizzi.play();

      });

      setTimeout(() => {
        pizzi.onended = () => {
          console.log('onEnded set?');
          this.nextTrack();
        };
        pizzi.sourceNode.playbackRate.value = effectsSettings.speed;
      }, 2500);
      this.pizzi = pizzi;
  }

  private parsePlaylistPaths(): void {
    if (this.playlist) {
      for (let song of this._playlistService.playlist) {
        this.playlistArray.push(this.rootDir + song.path);
      }
    }
  }

  private setPlaylist(): void {
    this.playlist = this._playlistService.playlist;
    this.parsePlaylistPaths();
  }

  private setOnEnded(): void {
    this.pizzi.sourceNode.onended = () => {
      this.nextTrack();
    };
  }

}
