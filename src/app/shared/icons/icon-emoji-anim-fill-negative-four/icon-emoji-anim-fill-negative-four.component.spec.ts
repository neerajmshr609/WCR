import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconEmojiAnimFillNegativeFourComponent } from './icon-emoji-anim-fill-negative-four.component';

describe('IconEmojiAnimFillNegativeFourComponent', () => {
  let component: IconEmojiAnimFillNegativeFourComponent;
  let fixture: ComponentFixture<IconEmojiAnimFillNegativeFourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconEmojiAnimFillNegativeFourComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IconEmojiAnimFillNegativeFourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
