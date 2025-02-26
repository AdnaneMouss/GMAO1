import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsEquipementsComponent } from './details-equipements.component';

describe('DetailsEquipementsComponent', () => {
  let component: DetailsEquipementsComponent;
  let fixture: ComponentFixture<DetailsEquipementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetailsEquipementsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetailsEquipementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
