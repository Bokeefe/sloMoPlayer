import { UserAlertService } from './../../shared/services/user-alert.service';
// angular
import {Component, DoCheck, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {MatDialog, MatSnackBar, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

// libraries
import * as Pizzicato from '../../../../node_modules/pizzicato/distr/Pizzicato.js';

// services
import {AudioService} from '../../shared/services/audio.service';
import {PlaylistService} from '../../shared/services/playlist.service';

// models
import {EffectsSettings} from '../../shared/models/effects-settings';
import {forkJoin, Subscription} from 'rxjs';
import {Song} from '../../shared/models/song';
import {SettingsService} from '../../shared/services/settings.service';

@Component({
  selector: 'app-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.css']
})
export class ControlComponent implements OnChanges, DoCheck, OnDestroy, OnInit {
  @Input() playlist: any;

  public currentSong: Song;

  public isPlaying: boolean;

  public isLoading: boolean;

  public audio: any;

  public audioReadyState: number;

  public playlistPosition: number;

  public effectsSettings: EffectsSettings;

  private isLoadingSub: Subscription;

  private isPlayingSub: Subscription;

  private currentSongSub: Subscription;

  private onNewGenreSub: Subscription;

  private rootDir: string;

  constructor(private _audioService: AudioService,
              private _playlistService: PlaylistService,
              private _settingsService: SettingsService,
              private _userAlertService: UserAlertService) {
    this.initSubs();
    this.effectsSettings = new EffectsSettings(.6, .7, .8);
    this.currentSong = new Song();
    this.rootDir = '/music/';
    this.setEffectsSettings();
    this.setPlaylistPosition();
  }

  public onSnail(): void {
    this._userAlertService.message();
  }

  public nextTrackPlay(): void {
    if (this.audio.playing) {
      this.audio.stop();
    }

    this._playlistService.incrementPlaylistPosition();

    this.setPlaylistPosition();
    if (this.playlistPosition < this.playlist.length) {
      this.initPizzi();
    } else {

      this._userAlertService.message('playlist finished');
    }

  }

  public togglePlay(): void {
    if (this.audio && this.audio.playing) {
      this.audio.pause();
      this.setIsPlaying(false);
    } else {
      if (this.audio && this.audio.paused) {
        this.audio.play();
      } else {
        this.initPizzi();
      }
      this.setIsPlaying(true);
    }
  }

  private initSubs(): void {
    this.isLoadingSub = this._audioService.isLoading$.subscribe(
      data => this.setIsLoading(data)
    );

    this.isPlayingSub = this._audioService.isPlaying$.subscribe(
      data => this.setIsPlaying(data)
    );

    this.currentSongSub = this._audioService.currentSong$.subscribe(
      data => this.setCurrentSong(data)
    );
  }

  private initPizzi(): void {

    this.audio = new Audio(this.rootDir + this.playlist[this.playlistPosition].path);
    console.log(this.playlist[this.playlistPosition]);
    this.currentSong = this.playlist[this.playlistPosition];
    console.dir(this.audio, this.effectsSettings);
    this.audio.playbackRate = 3;
    this.audio.volume = this.effectsSettings.volume;
    // const reverb = new Pizzicato.Effects.Reverb({
    //   time: 5,
    //   decay: 0.8,
    //   reverse: false,
    //   mix: this.effectsSettings.reverbMix
    // });

    this.audio.oncanplay = () => {
      this.audio.play();
      this.setIsPlaying(true);
    };

    this.audio.onended = () => {
      this.setIsPlaying(false);
      this.nextTrackPlay();
    };

  }

  private play(): void {
    this.audio.play();
  }

  private pause (): void {
    this.audio.pause();
  }

  private setCurrentSong (currentSong: Song): void {
    this.currentSong = currentSong;

    console.log(this._playlistService.getPlaylistPosition(),
      this.currentSong.title,
      this._settingsService.effectsSettings.speed,
      this.currentSong);
  }

  private setEffectsSettings(): void {
    this.effectsSettings = this._settingsService.getEffectsSettings();
  }

  private setIsLoading(isLoading): void {
    this.isLoading = isLoading;
  }

  private setAudio(audio: any): void {
    this.audio = audio;
  }

  private setIsPlaying(isPlaying): void {
    this.isPlaying = isPlaying;
  }

  private setOnEnded(): void {
    this.audio.oneded = this.nextTrackPlay();
  }

  private setPlaylistPosition(): void {
    this.playlistPosition = this._playlistService.getPlaylistPosition();
  }

  ngOnDestroy(): void {
    this.isPlayingSub.unsubscribe();
    this.isLoadingSub.unsubscribe();
    this.isLoadingSub.unsubscribe();
    this.currentSongSub.unsubscribe();
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.setPlaylistPosition();
    if (changes && !changes.playlist.firstChange && this.playlist.length) {
      this.initPizzi();
    }
  }

  ngDoCheck(): void {

  }
}
