import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListePiecesDetacheesComponent } from './liste-pieces-detachees.component';

describe('ListePiecesDetacheesComponent', () => {
  let component: ListePiecesDetacheesComponent;
  let fixture: ComponentFixture<ListePiecesDetacheesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListePiecesDetacheesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListePiecesDetacheesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
