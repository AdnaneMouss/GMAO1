import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LotAchatPieceComponent } from './lot-achat-piece.component';

describe('LotAchatPieceComponent', () => {
  let component: LotAchatPieceComponent;
  let fixture: ComponentFixture<LotAchatPieceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LotAchatPieceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LotAchatPieceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
