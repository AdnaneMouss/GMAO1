import { TestBed } from '@angular/core/testing';

import { MaintenanceCorrectiveService } from './maintenance-corrective.service';

describe('MaintenanceCorrectiveService', () => {
  let service: MaintenanceCorrectiveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MaintenanceCorrectiveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
