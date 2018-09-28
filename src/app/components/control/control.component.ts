// angular
import {Component, EventEmitter, Input, OnInit, ViewChild} from '@angular/core';

// libraries
import * as Pizzicato from '../../../../node_modules/pizzicato/distr/Pizzicato.js';
import {PlaylistService} from '../../shared/services/playlist.service';
import {FormControl, FormGroup} from '@angular/forms';


@Component({
  selector: 'app-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.css']
})
export class ControlComponent implements OnInit {
@ViewChild('speedRange') speedRange;
@ViewChild('verbMix') verbMix;
@Input('currentSong') currentSong;


  onEnded = new EventEmitter<string>();

  public pizzi: any;

  public playClass: string;

  public playerLoading: Boolean;

  private assetsDir: string;

  public playlist: Array<any>;

  private bypassReverbSettings: any;

  private defaultReverbSettings: any;

  constructor(private _playlistService: PlaylistService) {
    this.initPlaylist();
    this.setIsLoading(true);
    this.playClass = 'fa fa-play-circle-o';
    this.defaultReverbSettings = {
      time: 10,
      decay: 10,
      reverse: false,
      mix: .75
    };
    this.bypassReverbSettings = {
      time: .0001,
      decay: 0,
      reverse: false,
      mix: 0
    };
  }

  public onSettingsCallback(effectsParams: any): void {
    this.setEffectsParams(effectsParams);
  }

  public toggleReverb(): void {
    if (this.pizzi.effects[0]) {
      !this.pizzi.effects[0].mix ? this.setReverb(this.defaultReverbSettings.mix) : this.killReverb();
    } else {
      this.setReverb(this.defaultReverbSettings.mix);
    }
  }

  private setEffectsParams(effectsParams: any): void {
    if (this.pizzi.hasOwnProperty('sourceNode')) {
      this.pizzi.sourceNode.playbackRate.value = effectsParams.speed * .01;
    }
    if (this.pizzi.hasOwnProperty('volume')) {
      this.pizzi.volume = effectsParams.volume * .01;
    }
    if (this.pizzi.hasOwnProperty('effects')) {
      this.pizzi.effects[0].mix = effectsParams.reverbMix * .01;
    }
  }

  public playPause(): void {
    !this.pizzi.playing ? this.playFile() : this.pauseFile();
  }

  public setPlaybackSpeed(speed: number): void {
    this.pizzi.sourceNode.playbackRate.value = speed * .01;
  }

  public setVerbMix(value: number): void {
    if (this.pizzi.effects[0]) {
      this.pizzi.effects[0].mix = value * .01;
    } else {
      this.setReverb(value);
    }
  }

  public setVerbDecay(value: number): void {
    if (this.pizzi.effects[0]) {
      this.pizzi.effects[0].decay = value * 1;
    } else {
      this.setReverb(this.defaultReverbSettings.mix);
    }
  }

  public setVerbTime(value: number): void {
    if (this.pizzi.effects[0]) {
      this.pizzi.effects[0].time = value * 1;
    } else {
      this.setReverb(this.defaultReverbSettings.mix);
    }
  }

  public setVolume(value: number): void {
    this.pizzi.volume = value * .01;
  }

  private setReverb (value: number): void {
    if ( value > 1) { value = value * .01; }
    if (this.pizzi.effects[0]) {
      this.pizzi.effects[0].mix = value;
    } else {
      if (value) {
        const reverb = new Pizzicato.Effects.Reverb(this.defaultReverbSettings);
        this.pizzi.addEffect(reverb);
        this.pizzi.effects[0].mix = value;
      } else {
        const reverb = new Pizzicato.Effects.Reverb(this.defaultReverbSettings);
        this.pizzi.addEffect(reverb);
        this.pizzi.effects[0].mix = this.defaultReverbSettings.mix;
      }
    }
  }



  private initPlaylist(): void {
    this.playlist = JSON.parse(localStorage.getItem('playlist'));
  }

  private initSound(callback): void {
    this.assetsDir = './assets/';
    if (this.pizzi) { delete this.pizzi; }
    if (this.playlist) {
      this.pizzi = new Pizzicato.Sound(
        {
          source: 'file',
          options: { path: this.assetsDir + this.playlist[0].path }
        }, function() {
        }
      );
      this.initReverb();
    }
    callback();
  }

  private initReverb(): void {
    this.setReverb(this.defaultReverbSettings.mix);
  }

  public nextTrackPlay(): void {
    this.pauseFile();
    this.togglePlayClass();
    this.playlist.splice(0, 1);
    this.initSound(() => {
      setTimeout(() => { this.playFile(); }, 1000);
    });
  }

  private killReverb(): void {
    this.pizzi.effects[0].mix = 0;
  }

  private playFile(): void {
    this.pizzi.play();
    this.setOnEnd();
    this.togglePlayClass();
  }

  private pauseFile(): void {
    this.pizzi.pause();
    this.togglePlayClass();
  }

  private setIsLoading (setting: Boolean): void {
    this.playerLoading = setting;
  }

  private togglePlayClass(): void {
    if (this.pizzi.paused) {
      this.playClass = 'fa fa-play-circle-o';
    } else {
      this.playClass = 'fa fa-pause-circle-o';
    }
  }

  private setOnEnd(): void {
    this.pizzi.sourceNode.onended  = () => {
      this.nextTrackPlay();
    };
  }

  ngOnInit() {
   this.initSound(() => {
     setTimeout(() => {

       }, 3000);
   });
   this.setIsLoading(false);
  }
}
