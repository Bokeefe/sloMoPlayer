import {Component, OnInit} from '@angular/core';
import {PlaylistService} from '../../shared/services/playlist.service';
import {getRandomString} from '../../../../node_modules/@types/selenium-webdriver/safari';

@Component({
  selector: 'app-player-page',
  templateUrl: './player-page.component.html',
  styleUrls: ['./player-page.component.css']
})
export class PlayerPageComponent implements OnInit {

  public playlist: any;

  public genres: any;

  constructor(private _playlistService: PlaylistService) {
    this.setGenres();
  }

  public getPlaylist(genre: string): void {
    this.playlist = this._playlistService.getPlaylist(genre)
      .subscribe (
        data => {
          this.setPlaylist(data);
        },
        error => {
          alert(error);
        }
      );
  }

  public onSelect(song: any): void {
    console.log(song);
  }

  public setPlaylist(playlist: any): void {
    this.playlist = playlist;
    this.setLocalStoragePlaylist();
  }

  private getRandomGenre(): number {
    return Math.floor(Math.random() * (this.genres.length + 1));
  }

  private setGenres(): void {
    this._playlistService.getGenres()
      .subscribe(
        data => { this.genres  = data; }
      );
  }


  private setLocalStoragePlaylist(): void {
    if (localStorage.getItem('playlist')) { localStorage.removeItem('playlist'); }
    localStorage.setItem('playlist', JSON.stringify(this.playlist));
  }

  ngOnInit() {
    this.getPlaylist('harp');
  }
}
