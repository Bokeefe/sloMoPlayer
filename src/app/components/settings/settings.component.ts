// angular
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';

// services
import { AudioService } from './../../shared/services/audio.service';

// models
import { EffectsSettings } from './../../shared/models/effects-settings';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

@Input() settingsForm: FormGroup;

@Output() onSettingsCallback$: EventEmitter<any>;

  constructor(private _audioService: AudioService) {
    this.initSettingsForm();
    this.initFormChangeSub();
    this.onSettingsCallback$ = new EventEmitter<any>();
  }

  private initFormChangeSub(): void {
    this.settingsForm.valueChanges.subscribe(
      data => {
        const effectsSettings = new EffectsSettings(
          data.reverbMix * .01,
          data.speed * .01,
          data.volume * .01
        );
        this._audioService.setEffects(effectsSettings);
        this.onSettingsCallback$.emit(data);
      }
    );
  }

  private initSettingsForm(): void {
    this.settingsForm = new FormGroup({
      reverbMix: new FormControl(60),
      speed: new FormControl(70),
      volume: new FormControl(80)
    });
  }

  ngOnInit() {
  }

}
