import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddToReviewQueueComponent } from './add-to-review-queue.component';

describe('AddToReviewQueueComponent', () => {
  let component: AddToReviewQueueComponent;
  let fixture: ComponentFixture<AddToReviewQueueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddToReviewQueueComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddToReviewQueueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
