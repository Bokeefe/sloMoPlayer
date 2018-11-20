import { AudioService } from './../../shared/services/audio.service';
import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit, OnChanges {

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
        this._audioService.setEffects(data);

        this.onSettingsCallback$.emit(data);
      }
    );
  }

  private initSettingsForm(): void {
    this.settingsForm = new FormGroup({
      speed: new FormControl(80),
      volume: new FormControl(80),
      reverbMix: new FormControl(60),
    });
  }


  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.settingsForm.value);
  }

  ngOnInit() {
  }

}
