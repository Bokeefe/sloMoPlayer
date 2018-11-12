// angular
import {Component, EventEmitter, Output, OnInit, Input} from '@angular/core';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

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

  constructor() {
  }

  public songSelect(song: string): void {
    this.songSelected.emit(song);
  }

  public  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.playlist, event.previousIndex, event.currentIndex);
    console.log(event);
  }

  ngOnInit() {
  }
}
