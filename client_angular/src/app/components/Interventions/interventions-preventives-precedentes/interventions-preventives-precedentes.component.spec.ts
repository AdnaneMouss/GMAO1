import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterventionsPreventivesPrecedentesComponent } from './interventions-preventives-precedentes.component';

describe('InterventionsPreventivesPrecedentesComponent', () => {
  let component: InterventionsPreventivesPrecedentesComponent;
  let fixture: ComponentFixture<InterventionsPreventivesPrecedentesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InterventionsPreventivesPrecedentesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InterventionsPreventivesPrecedentesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
