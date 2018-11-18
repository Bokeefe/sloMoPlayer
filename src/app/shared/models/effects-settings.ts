export class EffectsSettings {

  private _reverbMix: number;

  private _speed: number;

  private _volume: number;


  constructor(reverbMix?: number,
              speed?: number,
              volume?: number) {
    this._reverbMix = reverbMix;
    this._speed = speed;
    this._volume = volume;
  }

  get reverbMix(): number {
    return this._reverbMix;
  }

  set reverbMix(reverbMix: number) {
    this._reverbMix = reverbMix;
  }

  get speed(): number {
    return this._speed;
  }

  set speed(speed: number) {
    this._speed = speed;
  }

  get volume(): number {
    return this._volume;
  }

  set volume(volume: number) {
    this._volume = volume;
  }

}
