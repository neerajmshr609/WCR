import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InfoPaneComponent } from './info-pane.component';

describe('InfoPaneComponent', () => {
  let component: InfoPaneComponent;
  let fixture: ComponentFixture<InfoPaneComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [InfoPaneComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoPaneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
