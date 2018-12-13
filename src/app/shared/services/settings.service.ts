import {EventEmitter, Injectable, Output} from '@angular/core';
import {EffectsSettings} from '../models/effects-settings';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  @Output() onSettingsChange$: EventEmitter<EffectsSettings>;

  public effectsSettings: EffectsSettings;

  constructor() {
    this.onSettingsChange$ = new EventEmitter<EffectsSettings>();
    this.setEffectsSettings(new EffectsSettings(.6, .7, .8));
  }

  public getEffectsSettings(): EffectsSettings {
    return this.effectsSettings;
  }

  public setEffectsSettings(effectsSettings: EffectsSettings): void {
    this.effectsSettings = effectsSettings;
    this.onSettingsChange$.emit(this.effectsSettings);
  }
}
