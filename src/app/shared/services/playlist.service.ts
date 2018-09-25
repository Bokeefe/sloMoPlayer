import {EventEmitter, Injectable, Output} from '@angular/core';
import {HttpClientService} from './http-client.service';

@Injectable()
export class PlaylistService {
  @Output() newGenre$: EventEmitter<any>;

  public genre: any;

  public genres: any;

  public playlist: any;

  constructor(private _httpClient: HttpClientService) {
    this.newGenre$ = new EventEmitter<any>();
    this.setGenres();
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

  public getPlaylist(genre: any): any {
    return this._httpClient.GET('/getPlaylist/' + genre);
  }


  public emitNewGenre(genre: any): void {
    this.newGenre$.emit(genre);
  }

  public setGenre(genre: any): void {
    this.genre = genre;
  }

  public setLocalPlaylist(playlist: any): void {
    localStorage.setItem('playlist', playlist);
  }

  private randomizePlaylist(playlist: Array<any>): Array<any> {
    return [];
  }

  private setGenres(): void {
    this.genres =  this._httpClient.GET('/genres/');
  }
}
