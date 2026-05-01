import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipementsParSalleComponent } from './equipements-par-salle.component';

describe('EquipementsParSalleComponent', () => {
  let component: EquipementsParSalleComponent;
  let fixture: ComponentFixture<EquipementsParSalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EquipementsParSalleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EquipementsParSalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
