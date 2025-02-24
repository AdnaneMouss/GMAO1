import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuiviStocksAlertesComponent } from './suivi-stocks-alertes.component';

describe('SuiviStocksAlertesComponent', () => {
  let component: SuiviStocksAlertesComponent;
  let fixture: ComponentFixture<SuiviStocksAlertesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SuiviStocksAlertesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SuiviStocksAlertesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
