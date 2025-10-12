import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadIframeBtnComponent } from './load-iframe-btn.component';

describe('LoadIframeBtnComponent', () => {
  let component: LoadIframeBtnComponent;
  let fixture: ComponentFixture<LoadIframeBtnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoadIframeBtnComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadIframeBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
