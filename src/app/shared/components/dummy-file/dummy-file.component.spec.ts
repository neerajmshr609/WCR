import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DummyFileComponent } from './dummy-file.component';

describe('DummyFileComponent', () => {
  let component: DummyFileComponent;
  let fixture: ComponentFixture<DummyFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DummyFileComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DummyFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
