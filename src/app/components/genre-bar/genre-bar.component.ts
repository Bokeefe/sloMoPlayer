import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {PlaylistService} from '../../shared/services/playlist.service';

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

  constructor(private _playlistService: PlaylistService) {
    this.onNewGenre$ =  new EventEmitter();

    this.getGenres();


  }

  public getGenres(): void {
    this._playlistService.getGenres()
      .subscribe(
        data => {
          this.setGenresArray(data);
          this.setActiveGenre(this.getRandGenre());
        },
        error => {
          alert(error);
        }
      );
  }

  public onNewGenre(event: any): void {
    this.setActiveGenre(event);
  }

  private emitNewGenre(genre: any): void {
    this._playlistService.emitNewGenre(genre);
  }

  private getRandGenre(): number {
    return Math.floor(Math.random() * this.genres.length);
  }

  private setActiveClass(): void {
    this.activeClass = this.activeGenre.field;
    this.emitNewGenre(this.activeGenre);
  }

  private setActiveGenre(genre: number): void {
    this.activeGenre = this.genres[genre];
    this._playlistService.setGenre(this.activeGenre);
    this.emitNewGenre(this.activeGenre);
  }

  private setGenresArray(genres: any): void {
    this.genres = genres;
  }

  ngOnInit() {
  }
}
