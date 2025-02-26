import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanneauNavigationComponent } from './panneau-navigation.component';

describe('PanneauNavigationComponent', () => {
  let component: PanneauNavigationComponent;
  let fixture: ComponentFixture<PanneauNavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PanneauNavigationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PanneauNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
