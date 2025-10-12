import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconEmojiAnimFillPositiveTwoComponent } from './icon-emoji-anim-fill-positive-two.component';

describe('IconEmojiAnimFillPositiveTwoComponent', () => {
  let component: IconEmojiAnimFillPositiveTwoComponent;
  let fixture: ComponentFixture<IconEmojiAnimFillPositiveTwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconEmojiAnimFillPositiveTwoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IconEmojiAnimFillPositiveTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
