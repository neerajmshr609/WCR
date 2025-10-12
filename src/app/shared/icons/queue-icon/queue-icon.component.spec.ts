import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueueIconComponent } from './queue-icon.component';

describe('QueueIconComponent', () => {
  let component: QueueIconComponent;
  let fixture: ComponentFixture<QueueIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QueueIconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(QueueIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
