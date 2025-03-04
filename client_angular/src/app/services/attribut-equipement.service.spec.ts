import { TestBed } from '@angular/core/testing';

import { AttributEquipementService } from './attribut-equipement.service';

describe('AttributEquipementService', () => {
  let service: AttributEquipementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AttributEquipementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
