import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  currentSong = 'made up first';


  public onSelect (song: string): void {
    this.currentSong = song;
  }
}
