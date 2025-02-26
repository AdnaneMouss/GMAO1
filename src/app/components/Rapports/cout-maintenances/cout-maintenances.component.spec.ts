import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoutMaintenancesComponent } from './cout-maintenances.component';

describe('CoutMaintenancesComponent', () => {
  let component: CoutMaintenancesComponent;
  let fixture: ComponentFixture<CoutMaintenancesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CoutMaintenancesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CoutMaintenancesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
