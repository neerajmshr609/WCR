import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendIconComponent } from './send-icon.component';

describe('SendIconComponent', () => {
  let component: SendIconComponent;
  let fixture: ComponentFixture<SendIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SendIconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SendIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
