import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TachesPreventivesAffecteeComponent } from './taches-preventives-affectee.component';

describe('TachesPreventivesAffecteeComponent', () => {
  let component: TachesPreventivesAffecteeComponent;
  let fixture: ComponentFixture<TachesPreventivesAffecteeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TachesPreventivesAffecteeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TachesPreventivesAffecteeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
