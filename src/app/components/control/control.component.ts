import { UserAlertService } from './../../shared/services/user-alert.service';
// angular
import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {MatDialog, MatSnackBar, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

// services
import {AudioService} from '../../shared/services/audio.service';
import {PlaylistService} from '../../shared/services/playlist.service';

// models
import {EffectsSettings} from '../../shared/models/effects-settings';
import {Subscription} from 'rxjs';
import {Song} from '../../shared/models/song';
import {current} from 'codelyzer/util/syntaxKind';

@Component({
  selector: 'app-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.css']
})
export class ControlComponent implements OnDestroy, OnInit {
  @Input() playlist: any;

  public currentSong: Song;

  public isPlaying: boolean;

  public isLoading: boolean;

  public pizzi: any;

  public effectsSettings: EffectsSettings;

  private isLoadingSub: Subscription;

  private isPlayingSub: Subscription;

  private currentSongSub: Subscription;


  public timePosition: Object;

  constructor(private _audioService: AudioService,
              private _playlistService: PlaylistService,
              private _userAlertService: UserAlertService) {
    this.effectsSettings = new EffectsSettings(.6, .7, .8);
    this.isLoadingSub = this._audioService.isLoading$.subscribe(
      data => this.setIsLoading(data)
    );
    this.isPlayingSub = this._audioService.isPlaying$.subscribe(
      data => this.setIsPlaying(data)
    );
    this.currentSongSub = this._audioService.currentSong$.subscribe(
      data => this.setCurrentSong(data)
    );

    this.currentSong = new Song();
  }


  public onOpenSnackBar(message: string): void {
    this._userAlertService.message(message);
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

  private setCurrentSong (currentSong: Song): void {
    this.currentSong = currentSong;
    console.log(this.currentSong.path);
  }

  private setEffectsSettings(effectsSettings: EffectsSettings): void {
    this.effectsSettings = effectsSettings;
  }

  private setIsLoading(isLoading): void {
    this.isLoading = isLoading;
  }

  private setIsPlaying(isPlaying): void {
    this.isPlaying = isPlaying;
  }

  private setTimePosition(timePosition: Object): void {
    this.timePosition = timePosition;
  }

  ngOnDestroy(): void {
    this.isPlayingSub.unsubscribe();
    this.isLoadingSub.unsubscribe();
    this.isLoadingSub.unsubscribe();
    this.currentSongSub.unsubscribe();
  }

  ngOnInit() {
  }

}
