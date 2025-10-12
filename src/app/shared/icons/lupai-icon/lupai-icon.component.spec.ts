import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LupaiIconComponent } from './lupai-icon.component';

describe('LupaiIconComponent', () => {
  let component: LupaiIconComponent;
  let fixture: ComponentFixture<LupaiIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LupaiIconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LupaiIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
