// angular
import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {MatDialog, MatSnackBar, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

// services
import {AudioService} from '../../shared/services/audio.service';
import {PlaylistService} from '../../shared/services/playlist.service';

// models
import {EffectsSettings} from '../../shared/models/effects-settings';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.css']
})
export class ControlComponent implements OnDestroy, OnInit {
  @Input() playlist: any;

  public isPlaying: boolean;

  public isLoading: boolean;

  public pizzi: any;

  public effectsSettings: EffectsSettings;

  private isPlayingSub: Subscription;

  public timePosition: Object;

  constructor(public _snackBar: MatSnackBar, private _audioService: AudioService,
              private _playlistService: PlaylistService) {
    this.effectsSettings = new EffectsSettings(.6, .8, .8);
    this.isPlayingSub = this._audioService.isPlaying$.subscribe(
      data => this.setIsPlaying(data)
    );
  }
  public openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }
  public nextTrackPlay(): void {
    this._audioService.nextTrack();
  }

  public onSettingsCallback(effectsParams: any): void {
    this.setEffectsSettings(effectsParams);
  }

  public togglePlay(): void {
    if (this._audioService.hasOwnProperty('pizzi') && this._audioService.pizzi.playing) {
      this._audioService.pause();
      this.setIsPlaying(false);
    } else {
      this._audioService.play();
      this.setIsPlaying(true);
    }
  }

  private setEffectsSettings(effectsSettings: EffectsSettings): void {
    this.effectsSettings = effectsSettings;
  }

  private setIsPlaying(isPlaying): void {
    this.isPlaying = isPlaying;
  }

  private setTimePosition(timePosition: Object): void {
    this.timePosition = timePosition;
  }

  ngOnDestroy(): void {
    this.isPlayingSub.unsubscribe();
  }

  ngOnInit() {
  }

}
