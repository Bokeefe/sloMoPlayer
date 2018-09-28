import {Component, EventEmitter, Output, OnInit, Input} from '@angular/core';
import {PlaylistService} from '../../shared/services/playlist.service';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css']
})
export class PlaylistComponent implements OnInit {
  @Input() playlist: any;

  @Output() songSelected = new EventEmitter<string>();

  constructor() {

  }

  public songSelect(song: string): void {
    this.songSelected.emit(song);
  }

  ngOnInit() {
    if (localStorage.getItem('playlist')) {
      this.playlist = JSON.parse(localStorage.getItem('playlist'));
    }
  }
}
