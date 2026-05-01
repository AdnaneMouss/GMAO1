import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SallesListeComponent } from './salles-liste.component';

describe('SallesListeComponent', () => {
  let component: SallesListeComponent;
  let fixture: ComponentFixture<SallesListeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SallesListeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SallesListeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
