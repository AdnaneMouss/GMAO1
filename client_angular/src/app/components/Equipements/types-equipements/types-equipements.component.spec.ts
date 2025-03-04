import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypesEquipementsComponent } from './types-equipements.component';

describe('TypesEquipementsComponent', () => {
  let component: TypesEquipementsComponent;
  let fixture: ComponentFixture<TypesEquipementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TypesEquipementsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TypesEquipementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
