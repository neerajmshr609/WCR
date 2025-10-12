import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FirstCardComponent } from './first-card.component';

describe('FirstCardComponent', () => {
  let component: FirstCardComponent;
  let fixture: ComponentFixture<FirstCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FirstCardComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FirstCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
