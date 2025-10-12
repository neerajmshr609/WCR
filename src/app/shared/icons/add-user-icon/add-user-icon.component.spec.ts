import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUserIconComponent } from './add-user-icon.component';

describe('AddUserIconComponent', () => {
  let component: AddUserIconComponent;
  let fixture: ComponentFixture<AddUserIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddUserIconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddUserIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
