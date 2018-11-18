// angular
import {Component, EventEmitter, Output, OnInit, Input} from '@angular/core';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

// services
import {PlaylistService} from '../../shared/services/playlist.service';

// models
import {Song} from '../../shared/models/song';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css']
})
export class PlaylistComponent implements OnInit {
  @Input() playlist: Array<Song>;

  @Output() songSelected = new EventEmitter<string>();

  constructor(private _playlistService: PlaylistService) {
  }

  public songSelect(song: string): void {
    this.songSelected.emit(song);
  }

  public  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.playlist, event.previousIndex, event.currentIndex);
    this._playlistService.setCurrentPlaylist(this.playlist);
    this.getPlaylist();
  }

  private getPlaylist(): void {
    this.playlist = this._playlistService.getPlaylist();
  }

  ngOnInit() {
  }
}
