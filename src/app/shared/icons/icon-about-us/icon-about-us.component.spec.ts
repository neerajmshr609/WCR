import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconAboutUsComponent } from './icon-about-us.component';

describe('IconAboutUsComponent', () => {
  let component: IconAboutUsComponent;
  let fixture: ComponentFixture<IconAboutUsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ IconAboutUsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IconAboutUsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
