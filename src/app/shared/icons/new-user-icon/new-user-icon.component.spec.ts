import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewUserIconComponent } from './new-user-icon.component';

describe('NewUserIconComponent', () => {
  let component: NewUserIconComponent;
  let fixture: ComponentFixture<NewUserIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewUserIconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NewUserIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
