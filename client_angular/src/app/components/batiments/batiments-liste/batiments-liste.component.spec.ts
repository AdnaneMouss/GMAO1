import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatimentsListeComponent } from './batiments-liste.component';

describe('BatimentsListeComponent', () => {
  let component: BatimentsListeComponent;
  let fixture: ComponentFixture<BatimentsListeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BatimentsListeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BatimentsListeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
