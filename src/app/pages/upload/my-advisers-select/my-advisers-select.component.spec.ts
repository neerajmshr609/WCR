import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MyAdvisersSelectComponent } from './my-advisers-select.component';

describe('MyAdvisersSelectComponent', () => {
  let component: MyAdvisersSelectComponent;
  let fixture: ComponentFixture<MyAdvisersSelectComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MyAdvisersSelectComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyAdvisersSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
