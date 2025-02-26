import { TestBed } from '@angular/core/testing';

import { OrdreTravailService } from './ordre-travail.service';

describe('OrdreTravailService', () => {
  let service: OrdreTravailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrdreTravailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
