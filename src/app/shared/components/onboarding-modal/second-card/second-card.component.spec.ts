import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SecondCardComponent } from './second-card.component';

describe('SecondCardComponent', () => {
  let component: SecondCardComponent;
  let fixture: ComponentFixture<SecondCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SecondCardComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecondCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
