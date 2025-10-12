import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileInfoLanguagesComponent } from './profile-info-languages.component';

describe('ProfileInfoLanguagesComponent', () => {
  let component: ProfileInfoLanguagesComponent;
  let fixture: ComponentFixture<ProfileInfoLanguagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileInfoLanguagesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileInfoLanguagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
