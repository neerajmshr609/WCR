import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AvPaneComponent } from './av-pane.component';

describe('AvPaneComponent', () => {
  let component: AvPaneComponent;
  let fixture: ComponentFixture<AvPaneComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AvPaneComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvPaneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
