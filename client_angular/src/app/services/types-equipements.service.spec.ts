import { TestBed } from '@angular/core/testing';

import { TypesEquipementsService } from './types-equipements.service';

describe('TypesEquipementsService', () => {
  let service: TypesEquipementsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TypesEquipementsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
