import {EventEmitter, Injectable, Output} from '@angular/core';
import {EffectsSettings} from '../models/effects-settings';
import {AudioService} from './audio.service';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  public effectsSettings: EffectsSettings;

  constructor() {
    this.setEffectsSettings(new EffectsSettings(.6, .7, .8));
  }

  public getEffectsSettings(): EffectsSettings {
    return this.effectsSettings;
  }

  public setEffectsSettings(effectsSettings: EffectsSettings): void {
    this.effectsSettings = effectsSettings;
  }
}
