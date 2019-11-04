// angular
import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';

// models
import { EffectsSettings } from './../../shared/models/effects-settings';
import {SettingsService} from '../../shared/services/settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

@Input() settingsForm: FormGroup;

  constructor(private _settingsService: SettingsService) {
  
  }

  private initFormChangeSub(): void {
    this.settingsForm.valueChanges.subscribe(
      data => {
        const effectsSettings = new EffectsSettings(
          data.lamronMode,
          data.reverbMix * .01,
          data.speed * .01,
          data.volume * .01
        );

        this._settingsService.setEffectsSettings(effectsSettings);
      }
    );
  }

  private initSettingsForm(): void {
    const localFX = JSON.parse(localStorage.getItem('effectsSettings'));
    if (!!localFX && localFX.hasOwnProperty('_lamronMode')) {
      this.settingsForm = new FormGroup({
        lamronMode: new FormControl(!!localFX._lamromMode),
        reverbMix: new FormControl(localFX._reverbMix * 100),
        speed: new FormControl(localFX._speed * 100),
        volume: new FormControl(localFX._volume * 100)
      });
    } else {
      this.settingsForm = new FormGroup({
        lamronMode: new FormControl(false),
        reverbMix: new FormControl(60),
        speed: new FormControl(70),
        volume: new FormControl(80)
      });
    }
  }

  ngOnInit() {
    this.initSettingsForm();
    this.initFormChangeSub();
  }
}
