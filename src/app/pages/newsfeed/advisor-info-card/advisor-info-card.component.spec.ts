import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AdvisorInfoCardComponent } from './advisor-info-card.component';

describe('AdvisorInfoCardComponent', () => {
  let component: AdvisorInfoCardComponent;
  let fixture: ComponentFixture<AdvisorInfoCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AdvisorInfoCardComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvisorInfoCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
