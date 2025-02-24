import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandePieceDetacheeComponent } from './demande-piece-detachee.component';

describe('DemandePieceDetacheeComponent', () => {
  let component: DemandePieceDetacheeComponent;
  let fixture: ComponentFixture<DemandePieceDetacheeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DemandePieceDetacheeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DemandePieceDetacheeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
