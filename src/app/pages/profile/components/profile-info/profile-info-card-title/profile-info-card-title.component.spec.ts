import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileInfoCardTitleComponent } from './profile-info-card-title.component';

describe('ProfileInfoCardTitleComponent', () => {
  let component: ProfileInfoCardTitleComponent;
  let fixture: ComponentFixture<ProfileInfoCardTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileInfoCardTitleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileInfoCardTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
