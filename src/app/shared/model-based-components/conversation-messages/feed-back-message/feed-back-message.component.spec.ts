import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedBackMessageComponent } from './feed-back-message.component';

describe('FeedBackMessageComponent', () => {
  let component: FeedBackMessageComponent;
  let fixture: ComponentFixture<FeedBackMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeedBackMessageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FeedBackMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
