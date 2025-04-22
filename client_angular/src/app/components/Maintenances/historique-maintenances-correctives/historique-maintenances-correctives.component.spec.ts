import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriqueMaintenancesCorrectivesComponent } from './historique-maintenances-correctives.component';

describe('HistoriqueMaintenancesCorrectivesComponent', () => {
  let component: HistoriqueMaintenancesCorrectivesComponent;
  let fixture: ComponentFixture<HistoriqueMaintenancesCorrectivesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HistoriqueMaintenancesCorrectivesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HistoriqueMaintenancesCorrectivesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
