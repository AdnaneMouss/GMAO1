import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardInterventionsComponent } from './dashboard-interventions.component';

describe('DashboardInterventionsComponent', () => {
  let component: DashboardInterventionsComponent;
  let fixture: ComponentFixture<DashboardInterventionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardInterventionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashboardInterventionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
