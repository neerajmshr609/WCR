import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconPublicProfileComponent } from './icon-public-profile.component';

describe('IconPublicProfileComponent', () => {
  let component: IconPublicProfileComponent;
  let fixture: ComponentFixture<IconPublicProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ IconPublicProfileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IconPublicProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
