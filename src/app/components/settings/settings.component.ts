// angular
import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';

// models
import { EffectsSettings } from './../../shared/models/effects-settings';
import {SettingsService} from '../../shared/services/settings.service';
import {AudioService} from '../../shared/services/audio.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

@Input() settingsForm: FormGroup;

  constructor(private _audioService: AudioService,
              private _settingsService: SettingsService) {
    this.initSettingsForm();
    this.initFormChangeSub();
  }

  private initFormChangeSub(): void {
    this.settingsForm.valueChanges.subscribe(
      data => {
        const effectsSettings = new EffectsSettings(
          data.reverbMix * .01,
          data.speed * .01,
          data.volume * .01
        );

        this._settingsService.setEffectsSettings(effectsSettings);
        this._audioService.setEffectsOnPizzi();

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
