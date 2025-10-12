import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SatisfiedIconComponent } from './satisfied-icon.component';

describe('DolarIconComponent', () => {
  let component: SatisfiedIconComponent;
  let fixture: ComponentFixture<SatisfiedIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SatisfiedIconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SatisfiedIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
