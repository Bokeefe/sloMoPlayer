import { TestBed } from '@angular/core/testing';

import { UserAlertService } from './user-alert.service';

describe('UserAlertService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserAlertService = TestBed.get(UserAlertService);
    expect(service).toBeTruthy();
  });
});
