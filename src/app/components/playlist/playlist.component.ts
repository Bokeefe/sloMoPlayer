// angular
import {Component, EventEmitter, Output, OnInit, Input, OnDestroy, ChangeDetectorRef} from '@angular/core';
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
export class PlaylistComponent implements OnInit, OnDestroy {
  @Input() playlist: Array<Song>;
  @Output() songSelected = new EventEmitter<string>();

  public playlistPosition: number;

  constructor(private cd: ChangeDetectorRef,
              private _playlistService: PlaylistService) {
    this.playlistPosition = 0;
    this._playlistService.newPlaylistPosition$.subscribe(
      data => {
        this.setPlaylistPosition(data);
        this.cd.detectChanges();
        console.log(data);
      }
    );
  }

  public deleteSong(event: number): void {
    this.playlist.splice(event, 1);
  }

  public drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.playlist, event.previousIndex, event.currentIndex);
    this._playlistService.setCurrentPlaylist(this.playlist);
    this.getPlaylist();
  }

  private getPlaylist(): void {
    this.playlist = this._playlistService.getPlaylist();
    this.playlistPosition = this._playlistService.getPlaylistPosition();
  }

  private setPlaylistPosition(position: number): void {
    this.playlistPosition = position;
  }

  ngOnDestroy(): void {
    this._playlistService.newPlaylistPosition$.unsubscribe();
  }

  ngOnInit() {
  }
}
