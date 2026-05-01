import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfosUtilisateursComponent } from './infos-utilisateurs.component';

describe('InfosUtilisateursComponent', () => {
  let component: InfosUtilisateursComponent;
  let fixture: ComponentFixture<InfosUtilisateursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InfosUtilisateursComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InfosUtilisateursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
