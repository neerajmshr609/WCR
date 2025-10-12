import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileTopicsExpertiseComponent } from './profile-topics-expertise.component';

describe('ProfileTopicsExpertiseComponent', () => {
  let component: ProfileTopicsExpertiseComponent;
  let fixture: ComponentFixture<ProfileTopicsExpertiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileTopicsExpertiseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileTopicsExpertiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
