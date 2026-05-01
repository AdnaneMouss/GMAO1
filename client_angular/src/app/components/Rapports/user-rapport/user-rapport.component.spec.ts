import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRapportComponent } from './user-rapport.component';

describe('UserRapportComponent', () => {
  let component: UserRapportComponent;
  let fixture: ComponentFixture<UserRapportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserRapportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserRapportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
