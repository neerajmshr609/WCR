import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAddRemoveMessageComponent } from './user-add-remove-message.component';

describe('UserAddRemoveMessageComponent', () => {
  let component: UserAddRemoveMessageComponent;
  let fixture: ComponentFixture<UserAddRemoveMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserAddRemoveMessageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UserAddRemoveMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
