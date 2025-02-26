import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriqueMaintenancesComponent } from './historique-maintenances.component';

describe('HistoriqueMaintenancesComponent', () => {
  let component: HistoriqueMaintenancesComponent;
  let fixture: ComponentFixture<HistoriqueMaintenancesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HistoriqueMaintenancesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HistoriqueMaintenancesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
