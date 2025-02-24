import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TachesAffecteesComponent } from './taches-affectees.component';

describe('TachesAffecteesComponent', () => {
  let component: TachesAffecteesComponent;
  let fixture: ComponentFixture<TachesAffecteesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TachesAffecteesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TachesAffecteesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
