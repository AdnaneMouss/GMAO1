import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeEquipementsComponent } from './liste-equipements.component';

describe('ListeEquipementsComponent', () => {
  let component: ListeEquipementsComponent;
  let fixture: ComponentFixture<ListeEquipementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListeEquipementsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListeEquipementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
