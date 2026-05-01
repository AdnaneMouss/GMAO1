import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccepterDemandesMaintenancesComponent } from './accepter-demandes-maintenances.component';

describe('AccepterDemandesMaintenancesComponent', () => {
  let component: AccepterDemandesMaintenancesComponent;
  let fixture: ComponentFixture<AccepterDemandesMaintenancesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccepterDemandesMaintenancesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AccepterDemandesMaintenancesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
