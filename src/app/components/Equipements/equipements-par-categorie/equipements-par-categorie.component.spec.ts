import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipementsParCategorieComponent } from './equipements-par-categorie.component';

describe('EquipementsParCategorieComponent', () => {
  let component: EquipementsParCategorieComponent;
  let fixture: ComponentFixture<EquipementsParCategorieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EquipementsParCategorieComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EquipementsParCategorieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
