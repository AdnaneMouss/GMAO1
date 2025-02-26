import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatistiquesInterventionsComponent } from './statistiques-interventions.component';

describe('StatistiquesInterventionsComponent', () => {
  let component: StatistiquesInterventionsComponent;
  let fixture: ComponentFixture<StatistiquesInterventionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StatistiquesInterventionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StatistiquesInterventionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
