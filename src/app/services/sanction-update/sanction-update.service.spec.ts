import { TestBed } from '@angular/core/testing';

import { SanctionUpdateService } from './sanction-update.service';

describe('SanctionUpdateService', () => {
  let service: SanctionUpdateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SanctionUpdateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
