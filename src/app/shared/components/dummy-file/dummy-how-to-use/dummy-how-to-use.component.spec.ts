import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DummyHowToUseComponent } from './dummy-how-to-use.component';

describe('DummyHowToUseComponent', () => {
  let component: DummyHowToUseComponent;
  let fixture: ComponentFixture<DummyHowToUseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DummyHowToUseComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DummyHowToUseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
