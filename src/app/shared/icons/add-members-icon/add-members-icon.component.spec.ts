import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMembersIconComponent } from './add-members-icon.component';

describe('AddMembersIconComponent', () => {
  let component: AddMembersIconComponent;
  let fixture: ComponentFixture<AddMembersIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddMembersIconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddMembersIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
