import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconNewUserComponent } from './icon-new-user.component';

describe('IconNewUserComponent', () => {
  let component: IconNewUserComponent;
  let fixture: ComponentFixture<IconNewUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconNewUserComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IconNewUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
