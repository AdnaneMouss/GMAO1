import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EtagesListeComponent } from './etages-liste.component';

describe('EtagesListeComponent', () => {
  let component: EtagesListeComponent;
  let fixture: ComponentFixture<EtagesListeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EtagesListeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EtagesListeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
