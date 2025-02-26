import { TestBed } from '@angular/core/testing';

import { PieceDetacheeService } from './piece-detachee.service';

describe('PieceDetacheeService', () => {
  let service: PieceDetacheeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PieceDetacheeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
