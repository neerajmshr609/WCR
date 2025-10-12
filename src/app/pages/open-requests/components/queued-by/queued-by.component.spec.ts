import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueuedByComponent } from './queued-by.component';

describe('QueuedByComponent', () => {
  let component: QueuedByComponent;
  let fixture: ComponentFixture<QueuedByComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QueuedByComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(QueuedByComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
