import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconEmojiAnimFillNegativeTwoComponent } from './icon-emoji-anim-fill-negative-two.component';

describe('IconEmojiAnimFillNegativeTwoComponent', () => {
  let component: IconEmojiAnimFillNegativeTwoComponent;
  let fixture: ComponentFixture<IconEmojiAnimFillNegativeTwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconEmojiAnimFillNegativeTwoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IconEmojiAnimFillNegativeTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
