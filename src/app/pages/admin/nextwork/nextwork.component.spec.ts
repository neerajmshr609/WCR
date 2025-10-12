import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NextworkComponent } from './nextwork.component';

describe('NextworkComponent', () => {
  let component: NextworkComponent;
  let fixture: ComponentFixture<NextworkComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [NextworkComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NextworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
