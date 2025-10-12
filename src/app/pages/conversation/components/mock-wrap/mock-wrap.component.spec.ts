import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockWrapComponent } from './mock-wrap.component';

describe('MockWrapComponent', () => {
  let component: MockWrapComponent;
  let fixture: ComponentFixture<MockWrapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MockWrapComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MockWrapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
