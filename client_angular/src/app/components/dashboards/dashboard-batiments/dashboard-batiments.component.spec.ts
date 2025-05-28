import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardBatimentsComponent } from './dashboard-batiments.component';

describe('DashboardBatimentsComponent', () => {
  let component: DashboardBatimentsComponent;
  let fixture: ComponentFixture<DashboardBatimentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardBatimentsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashboardBatimentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
