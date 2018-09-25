import { Injectable } from '@angular/core';

@Injectable()
export class TagReaderService {
  public fileSrc: string;
  public fileReader: any;
  constructor() {
    this.fileSrc = '../../../assets/music';
  }

  public getAllTags(): any {
    const tags = [
      {
        'title': 'song Title',
        'artist': 'whatevr boner'
      },
      {
        'title': 'next song',
        'artist': 'another artist'
      }
    ];
    return tags;
  }

  public test (): any {
    this.fileReader = new FileReader();
    return this.fileReader;
  }
}
