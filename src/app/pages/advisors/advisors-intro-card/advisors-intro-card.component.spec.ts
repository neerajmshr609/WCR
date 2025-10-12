import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AdvisorsIntroCardComponent } from './advisors-intro-card.component';

describe('AdvisorsIntroCardComponent', () => {
  let component: AdvisorsIntroCardComponent;
  let fixture: ComponentFixture<AdvisorsIntroCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AdvisorsIntroCardComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvisorsIntroCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
