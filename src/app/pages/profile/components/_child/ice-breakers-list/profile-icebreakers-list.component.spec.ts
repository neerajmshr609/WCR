import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileIcebreakersListComponent } from './profile-icebreakers-list.component';

describe('ProfileIcebreakersListComponent', () => {
  let component: ProfileIcebreakersListComponent;
  let fixture: ComponentFixture<ProfileIcebreakersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileIcebreakersListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileIcebreakersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
