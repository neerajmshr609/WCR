import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CreativesInfoCardComponent } from './creatives-info-card.component';

describe('CreativesInfoCardComponent', () => {
  let component: CreativesInfoCardComponent;
  let fixture: ComponentFixture<CreativesInfoCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CreativesInfoCardComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreativesInfoCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
