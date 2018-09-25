import { TestBed, inject } from '@angular/core/testing';

import { PizziService } from './pizzi.service';

describe('PizziService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PizziService]
    });
  });

  it('should be created', inject([PizziService], (service: PizziService) => {
    expect(service).toBeTruthy();
  }));
});
