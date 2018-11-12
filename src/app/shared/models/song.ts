export class Song {

  private _album: string;

  private _artist: string;

  private _genre: string;

  private _title: string;

  private _path: string;


  get album(): string {
    return this._album;
  }

  set album(album: string) {
    this._album = album;
  }

  get artist(): string {
    return this._artist;
  }

  set artist(artist: string) {
    this._artist = artist;
  }

  get genre(): string {
    return this._genre;
  }

  set genre(genre: string) {
    this._genre = genre;
  }

  get title(): string {
    return this._title;
  }

  set title(title: string) {
    this._title = title;
  }

  get path(): string {
    return this._path;
  }

  set path(path: string) {
    this._path = path;
  }
}
