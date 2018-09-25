import { TestBed, inject } from '@angular/core/testing';

import { TagReaderService } from './tag-reader.service';

describe('TagReaderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TagReaderService]
    });
  });

  it('should be created', inject([TagReaderService], (service: TagReaderService) => {
    expect(service).toBeTruthy();
  }));
});
