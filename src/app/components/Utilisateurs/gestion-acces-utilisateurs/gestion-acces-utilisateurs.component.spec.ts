import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionAccesUtilisateursComponent } from './gestion-acces-utilisateurs.component';

describe('GestionAccesUtilisateursComponent', () => {
  let component: GestionAccesUtilisateursComponent;
  let fixture: ComponentFixture<GestionAccesUtilisateursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GestionAccesUtilisateursComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GestionAccesUtilisateursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
