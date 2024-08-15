import { TestBed } from '@angular/core/testing';

import { EcologyUpdateService } from './ecology-update.service';

describe('EcologyUpdateService', () => {
  let service: EcologyUpdateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EcologyUpdateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
