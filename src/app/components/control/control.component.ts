// angular
import {Component, EventEmitter, Input, OnInit} from '@angular/core';

// libraries
import * as Pizzicato from '../../../../node_modules/pizzicato/distr/Pizzicato.js';

// models
import {Settings} from '../../shared/models/settings';


@Component({
  selector: 'app-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.css']
})
export class ControlComponent implements OnInit {
  @Input() playlist: any;

  public pizzi: any;

  public playClass: string;

  public playerLoading: Boolean;

  private assetsDir: string;

  private effectsSettings: Settings;

  constructor() {
    this.playClass = 'fa fa-play-circle-o';
    this.initEffects();
  }

  public nextTrackPlay(): void {
    this.pauseFile();
    this.togglePlayClass();
    this.playlist.splice(0, 1);
    this.initSound(this.playlist, () => {
      setTimeout(() => {
        this.playFile();
      }, 1000);
    });
  }


  public onNewPlaylist(event: any): void {
    this.setPlaylist(event);
  }


  public onSettingsCallback(effectsParams: any): void {
    this.setEffectsParamsOnPizzi(effectsParams);
  }

  public toggleReverb(): void {
   console.log('toggleReverb', this.pizzi);
  }

  public togglePlay(): void {
    if (this.pizzi) {
      !this.pizzi.playing ? this.playFile() : this.pauseFile();
    } else {
      console.log(this.playlist[0].path, this.pizzi);
    }
  }

  private initSound(playlist, callback): void {
    this.assetsDir = './assets/music/';

    if (this.pizzi) {
      delete this.pizzi;
    }

    this.pizzi = Pizzicato.Sound({
      source: 'file',
      options: { path: this.assetsDir + playlist[0].path }
    }, function() {

      this.pizzi.play();
    });

    callback();
  }

  private initEffects(): void {
    this.effectsSettings = new Settings(80, 60, 80);
  }

  private initReverb(): void {
    const verb = new Pizzicato.Effects.Reverb({
      time: 9,
      decay: 9,
      reverse: false,
      mix: 0.8
    });
    this.pizzi.addEffect(verb);
  }

  private initSpeed(): void {
    if (this.pizzi.hasOwnProperty('sourceNode')) {
     this.pizzi.sourceNode.playbackRate.value = this.effectsSettings.speed * .01;
    }
  }

  private playFile(): void {
    console.log('playFiles', this.pizzi);
    this.pizzi.play();
    this.setOnEnd();
    this.togglePlayClass();
  }

  private pauseFile(): void {
    this.pizzi.pause();
    this.togglePlayClass();
  }

  private setReverb(): void {
    if (this.pizzi.effects[0]) {
      this.pizzi.effects[0].mix = this.effectsSettings.reverbMix;
    } else {
      if (this.effectsSettings.reverbMix) {
        const reverb = new Pizzicato.Effects.Reverb();
        this.pizzi.addEffect(reverb);
        this.pizzi.effects[0].mix = this.effectsSettings.reverbMix;
      } else {
        const reverb = new Pizzicato.Effects.Reverb();
        this.pizzi.addEffect(reverb);
        this.pizzi.effects[0].mix = this.effectsSettings.reverbMix;
      }
    }
  }

  public setEffectsParamsOnPizzi(effectsParams: Settings): void {
   if (this.pizzi.volume) {
     this.pizzi.volume = effectsParams.volume * .01;
   }
    if (this.pizzi.playbackRate) {
      this.pizzi.playbackRate = effectsParams.speed * .01;
    }
  }

  private setPlaylist(playlist: any): void {
    this.playlist = playlist;
  }

  private setOnEnd(): void {
    this.pizzi.sourceNode.onended = () => {
      this.pizzi.sourceNode.playbackRate.value = .5;

      this.nextTrackPlay();
    };
  }

  private togglePlayClass(): void {
    if (this.pizzi.paused) {
      this.playClass = 'fa fa-play-circle-o';
    } else {
      this.playClass = 'fa fa-pause-circle-o';
    }
  }

  ngOnInit() {
  }
}
