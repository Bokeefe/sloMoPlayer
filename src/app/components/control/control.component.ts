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
import {Subscription} from 'rxjs';
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
    this.setEffectsSettings(new EffectsSettings(.6, .7, .8));
    this.setPlaylistPosition();
    this._settingsService.onSettingsChange$.subscribe(
      data => this.setEffectsSettings(data)
    );
  }

  public onSnail(): void {
    this._userAlertService.message();
  }

  public nextTrackPlay(): void {
    if (this.audio.playing) {
      this.audio.stop();
      this.setIsPlaying(false);
    }

    this._playlistService.incrementPlaylistPosition();

    this.setPlaylistPosition();
    if (this.playlistPosition < this.playlist.length) {
      this.initAudio();
    } else {
      this._userAlertService.message('playlist finished');
    }

  }

  public togglePlay(): void {
    if (this.audio && this.audio.playing) {
      this.audio.pause();
      this.setIsPlaying(false);
    } else if (this.audio && this.audio.paused) {
        this.audio.play();
        this.setIsPlaying(true);
    } else if (!this.audio) {
      this._userAlertService.message('please pick a playlist');
    }
  }

  private initSubs(): void {
    this.isLoadingSub = this._audioService.isLoading$.subscribe(
      data => this.setIsLoading(data)
    );

    this.isPlayingSub = this._audioService.isPlaying$.subscribe(
      data => this.setIsPlaying(data)
    );
  }

  private initAudio(): void {

    if (this.audio && this.audio.playing) {
      this.audio.stop();
      this.setIsPlaying(false);
      delete this.audio;
    } else if (this.audio && !this.audio.playing) {
      this.setIsPlaying(false);
      delete this.audio;
    }

    this.setCurrentSong();
    this.setIsPlaying(true);
    this.setIsLoading(false);

    this.audio = new Pizzicato.Sound(this.rootDir + this.playlist[this.playlistPosition].path, () => {
      const reverb = new Pizzicato.Effects.Reverb({
        time: 5,
        decay: 0.8,
        reverse: false,
        mix: this.effectsSettings.reverbMix
      });

      this.audio.addEffect(reverb);

      this.audio.play();
      this.audio.sourceNode.playbackRate.value = this.effectsSettings.speed;
      this.audio.volume = this.effectsSettings.volume;
      this.audio.sourceNode.onended = () => {
        this.setIsLoading(true);
        this.setIsPlaying(false);
        this.nextTrackPlay();
      };
    });
  }

  private setCurrentSong (): void {
    this.currentSong = new Song();
    this.currentSong = this.playlist[this.playlistPosition];
    console.log(this.playlistPosition, this.playlist[this.playlistPosition].path);
  }

  // private setEffectsSettings(): void {
  //   this.effectsSettings = this._settingsService.getEffectsSettings();
  // }

  private setIsLoading(isLoading): void {
    this.isLoading = isLoading;
  }

  private setAudio(audio: any): void {
    this.audio = audio;
  }

  private setEffectsSettings(effectsSettings: EffectsSettings): void {
    this.effectsSettings = effectsSettings;
    if (this.audio) {
      this.audio.volume = this.effectsSettings.volume;
      this.audio.sourceNode.playbackRate.value = 6;
      this.audio.effects[0].mix = this.effectsSettings.reverbMix;
    }
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
      this.playlistPosition = 0;
      if (this.audio && this.audio.playing) {
        this.audio.stop();
        delete this.audio;
        setTimeout(() => {
          this.initAudio();
        }, 1000);
      } else {
        this.initAudio();
      }
    }
  }

  ngDoCheck(): void {

  }
}
