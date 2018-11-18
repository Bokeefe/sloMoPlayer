import { Settings } from './../models/settings';
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
    this.rootDir = '../../../../assets/music/';
  }

  public getAudio(id: number): void {
  }

  public play(effectsParams?: Settings): void {
    this.setPlaylist();

    if (this.pizzi) {
      delete this.pizzi;
    }

    console.log(this.playlistArray);
    const pizzi = new Pizzicato.Sound({
        source: 'file',
        options: {
            path: this.playlistArray,
            volume: effectsParams.volume
        }
      }, function() {
        const reverb = new Pizzicato.Effects.Reverb({
            time: 5,
            decay: 0.8,
            reverse: false,
            mix: effectsParams.reverbMix
        });
        pizzi.addEffect(reverb);
        pizzi.play();
      });
      setTimeout(() => {
        pizzi.sourceNode.playbackRate.value = effectsParams.speed;
      }, 2000);
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

}
