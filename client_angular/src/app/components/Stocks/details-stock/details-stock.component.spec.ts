import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsStockComponent } from './details-stock.component';

describe('DetailsStockComponent', () => {
  let component: DetailsStockComponent;
  let fixture: ComponentFixture<DetailsStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetailsStockComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetailsStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
