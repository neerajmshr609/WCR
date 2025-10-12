import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconEmojiAnimFillNoRatingComponent } from './icon-emoji-anim-fill-no-rating.component';

describe('IconEmojiAnimFillNoRatingComponent', () => {
  let component: IconEmojiAnimFillNoRatingComponent;
  let fixture: ComponentFixture<IconEmojiAnimFillNoRatingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconEmojiAnimFillNoRatingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IconEmojiAnimFillNoRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
