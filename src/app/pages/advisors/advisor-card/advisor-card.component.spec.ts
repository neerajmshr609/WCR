import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AdvisorCardComponent } from './advisor-card.component';

describe('AdvisorCardComponent', () => {
  let component: AdvisorCardComponent;
  let fixture: ComponentFixture<AdvisorCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AdvisorCardComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvisorCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
