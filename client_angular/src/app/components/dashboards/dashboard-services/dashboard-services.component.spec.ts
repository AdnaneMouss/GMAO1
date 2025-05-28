import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardServicesComponent } from './dashboard-services.component';

describe('DashboardServicesComponent', () => {
  let component: DashboardServicesComponent;
  let fixture: ComponentFixture<DashboardServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardServicesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashboardServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
