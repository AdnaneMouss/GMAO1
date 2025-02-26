import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenancesCorrectivesComponent } from './maintenances-correctives.component';

describe('MaintenancesCorrectivesComponent', () => {
  let component: MaintenancesCorrectivesComponent;
  let fixture: ComponentFixture<MaintenancesCorrectivesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MaintenancesCorrectivesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MaintenancesCorrectivesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
