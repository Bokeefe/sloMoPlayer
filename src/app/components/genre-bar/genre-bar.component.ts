// angular
import {Component, EventEmitter, OnInit, Output} from '@angular/core';

// services
import {PlaylistService} from '../../shared/services/playlist.service';
import {AudioService} from '../../shared/services/audio.service';

@Component({
  selector: 'app-genre-bar',
  templateUrl: './genre-bar.component.html',
  styleUrls: ['./genre-bar.component.css']
})
export class GenreBarComponent implements OnInit {
  @Output() onNewGenre$: EventEmitter<any>;

  public activeClass: any;

  public activeGenre: any;

  public genres: any;

  constructor(private _audioService: AudioService,
              private _playlistService: PlaylistService) {
    this.onNewGenre$ =  new EventEmitter<any>();
    this.getGenres();
  }

  public getGenres(): void {
    this._playlistService.getGenres()
      .subscribe(
        data => this.setGenresArray(data),
        error => console.log(JSON.parse(error))
      );
  }

  public onNewGenre(event: any): void {
    this._audioService.stop(() => {

    });
    this.setActiveGenre(event);
  }

  private setActiveGenre(genre: number): void {
    this.activeGenre = this.genres[genre];
    this._playlistService.setGenre(this.activeGenre);
    this.onNewGenre$.emit(genre);
  }

  private setGenresArray(genres: any): void {
    this.genres = genres;
  }

  ngOnInit() {
  }
}
