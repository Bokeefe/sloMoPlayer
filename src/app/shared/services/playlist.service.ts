// angular
import {EventEmitter, Injectable, Output} from '@angular/core';

// services
import {HttpClientService} from './http-client.service';

// models
import {Song} from '../models/song';
import {Observable, of} from 'rxjs';

@Injectable()
export class PlaylistService {
  @Output() newGenre$: EventEmitter<any>;
  @Output() newPlaylistPosition$: EventEmitter<any>;

  public genre: any;

  public genres: any;

  public playlist: Array<Song>;

  public playlistPosition: number;

  constructor(private _httpClient: HttpClientService) {
    this.newGenre$ = new EventEmitter<any>();
    this.newPlaylistPosition$ = new EventEmitter<any>();
    this.playlistPosition = 0;
    this.setGenres();
  }

  public deletePlaylist(): void {
    this.setCurrentPlaylist([]);
  }

  public getGenre(): string {
    return this.genre;
  }
  public getGenres(): any {
    return this._httpClient.GET('/genres/');
  }

  public getRandGenre(): number {
    return this.genres[Math.floor(Math.random() * this.genres.length)];
  }

  public getRandomPlaylist(): any {
    return this._httpClient.GET('/getPlaylist/' + this.getRandGenre());
  }

  public getNewPlaylist(genre: any): any {
    delete this.playlist;
    this.playlistPosition = 0;
    return this._httpClient.GET('/getPlaylist/' + genre);
  }

  public getPlaylist(): Array<Song> {
    return this.playlist;
  }

  public getPlaylistPosition(): number {
    return this.playlistPosition;
  }

  public incrementPlaylistPosition(): void {
    this.playlistPosition++;
    this.newPlaylistPosition$.emit(this.playlistPosition);
  }

  public emitNewGenre(genre: any): void {
    this.newGenre$.emit(genre);
  }

  public setGenre(genre: any): void {
    this.genre = genre;
  }

  public setCurrentPlaylist(playlist: Array<Song>): void {
    this.playlist = playlist;
  }

  private randomizePlaylist(playlist: Array<any>): Array<any> {
    return [];
  }

  private setGenres(): void {
    this.genres =  this._httpClient.GET('/genres/');
  }
}
