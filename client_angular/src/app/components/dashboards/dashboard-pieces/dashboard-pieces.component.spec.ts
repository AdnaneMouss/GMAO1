import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardPiecesComponent } from './dashboard-pieces.component';

describe('DashboardPiecesComponent', () => {
  let component: DashboardPiecesComponent;
  let fixture: ComponentFixture<DashboardPiecesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardPiecesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashboardPiecesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
