import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconEmojiAnimFillPositiveZeroComponent } from './icon-emoji-anim-fill-positive-zero.component';

describe('IconEmojiAnimFillPositiveZeroComponent', () => {
  let component: IconEmojiAnimFillPositiveZeroComponent;
  let fixture: ComponentFixture<IconEmojiAnimFillPositiveZeroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconEmojiAnimFillPositiveZeroComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IconEmojiAnimFillPositiveZeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
