import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CreativesProjectCardComponent } from './creatives-project-card.component';

describe('CreativesProjectCardComponent', () => {
  let component: CreativesProjectCardComponent;
  let fixture: ComponentFixture<CreativesProjectCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CreativesProjectCardComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreativesProjectCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
