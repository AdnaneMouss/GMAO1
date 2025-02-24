import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenancesPreventivesComponent } from './maintenances-preventives.component';

describe('MaintenancesPreventivesComponent', () => {
  let component: MaintenancesPreventivesComponent;
  let fixture: ComponentFixture<MaintenancesPreventivesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MaintenancesPreventivesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MaintenancesPreventivesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
