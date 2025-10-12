import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkIconComponent } from './mark-icon.component';

describe('MarkIconComponent', () => {
  let component: MarkIconComponent;
  let fixture: ComponentFixture<MarkIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MarkIconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MarkIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
