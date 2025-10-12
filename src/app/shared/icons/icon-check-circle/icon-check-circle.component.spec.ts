import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconCheckCircleComponent } from './icon-check-circle.component';

describe('IconCheckCircleComponent', () => {
  let component: IconCheckCircleComponent;
  let fixture: ComponentFixture<IconCheckCircleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconCheckCircleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IconCheckCircleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
