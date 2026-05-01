import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardMaintenanceComponent } from './dashboard-maintenance.component';

describe('DashboardMaintenanceComponent', () => {
  let component: DashboardMaintenanceComponent;
  let fixture: ComponentFixture<DashboardMaintenanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardMaintenanceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashboardMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
