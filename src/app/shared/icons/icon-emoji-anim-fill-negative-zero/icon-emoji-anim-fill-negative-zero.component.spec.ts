import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconEmojiAnimFillNegativeZeroComponent } from './icon-emoji-anim-fill-negative-zero.component';

describe('IconEmojiAnimFillNegativeZeroComponent', () => {
  let component: IconEmojiAnimFillNegativeZeroComponent;
  let fixture: ComponentFixture<IconEmojiAnimFillNegativeZeroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconEmojiAnimFillNegativeZeroComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IconEmojiAnimFillNegativeZeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
