import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsEquipementsPiecesComponent } from './details-equipements-pieces.component';

describe('DetailsEquipementsPiecesComponent', () => {
  let component: DetailsEquipementsPiecesComponent;
  let fixture: ComponentFixture<DetailsEquipementsPiecesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetailsEquipementsPiecesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetailsEquipementsPiecesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
