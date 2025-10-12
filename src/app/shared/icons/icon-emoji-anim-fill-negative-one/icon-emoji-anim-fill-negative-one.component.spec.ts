import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconEmojiAnimFillNegativeOneComponent } from './icon-emoji-anim-fill-negative-one.component';

describe('IconEmojiAnimFillNegativeOneComponent', () => {
  let component: IconEmojiAnimFillNegativeOneComponent;
  let fixture: ComponentFixture<IconEmojiAnimFillNegativeOneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconEmojiAnimFillNegativeOneComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IconEmojiAnimFillNegativeOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
