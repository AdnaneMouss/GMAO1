import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriesEquipementsComponent } from './categories-equipements.component';

describe('CategoriesEquipementsComponent', () => {
  let component: CategoriesEquipementsComponent;
  let fixture: ComponentFixture<CategoriesEquipementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CategoriesEquipementsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CategoriesEquipementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
