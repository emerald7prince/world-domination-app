import { TestBed } from '@angular/core/testing';

import { EndTurnService } from './end-turn.service';

describe('EndTurnService', () => {
  let service: EndTurnService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EndTurnService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
