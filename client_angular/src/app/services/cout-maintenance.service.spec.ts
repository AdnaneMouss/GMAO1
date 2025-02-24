import { TestBed } from '@angular/core/testing';

import { CoutMaintenanceService } from './cout-maintenance.service';

describe('CoutMaintenanceService', () => {
  let service: CoutMaintenanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoutMaintenanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
