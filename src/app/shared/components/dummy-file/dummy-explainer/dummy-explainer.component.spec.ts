import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DummyExplainerComponent } from './dummy-explainer.component';

describe('DummyExplainerComponent', () => {
  let component: DummyExplainerComponent;
  let fixture: ComponentFixture<DummyExplainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DummyExplainerComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DummyExplainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
