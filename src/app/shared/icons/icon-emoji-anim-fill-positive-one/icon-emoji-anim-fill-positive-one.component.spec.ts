import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconEmojiAnimFillPositiveOneComponent } from './icon-emoji-anim-fill-positive-one.component';

describe('IconEmojiAnimFillPositiveOneComponent', () => {
  let component: IconEmojiAnimFillPositiveOneComponent;
  let fixture: ComponentFixture<IconEmojiAnimFillPositiveOneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconEmojiAnimFillPositiveOneComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IconEmojiAnimFillPositiveOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
