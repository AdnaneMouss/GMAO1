import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterventionsPrecedentesComponent } from './interventions-precedentes.component';

describe('InterventionsPrecedentesComponent', () => {
  let component: InterventionsPrecedentesComponent;
  let fixture: ComponentFixture<InterventionsPrecedentesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InterventionsPrecedentesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InterventionsPrecedentesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
