import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardEquipementsComponent } from './dashboard-equipements.component';

describe('DashboardEquipementsComponent', () => {
  let component: DashboardEquipementsComponent;
  let fixture: ComponentFixture<DashboardEquipementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardEquipementsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashboardEquipementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
