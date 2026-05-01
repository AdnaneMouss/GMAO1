import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandeMaintenancesComponent } from './demande-maintenances.component';

describe('DemandeMaintenancesComponent', () => {
  let component: DemandeMaintenancesComponent;
  let fixture: ComponentFixture<DemandeMaintenancesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DemandeMaintenancesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DemandeMaintenancesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
