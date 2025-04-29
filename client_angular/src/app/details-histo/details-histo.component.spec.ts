import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsHistoComponent } from './details-histo.component';

describe('DetailsHistoComponent', () => {
  let component: DetailsHistoComponent;
  let fixture: ComponentFixture<DetailsHistoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetailsHistoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetailsHistoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
