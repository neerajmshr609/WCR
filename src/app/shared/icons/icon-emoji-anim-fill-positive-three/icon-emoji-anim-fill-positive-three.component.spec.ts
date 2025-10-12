import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconEmojiAnimFillPositiveThreeComponent } from './icon-emoji-anim-fill-positive-three.component';

describe('IconEmojiAnimFillPositiveThreeComponent', () => {
  let component: IconEmojiAnimFillPositiveThreeComponent;
  let fixture: ComponentFixture<IconEmojiAnimFillPositiveThreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconEmojiAnimFillPositiveThreeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IconEmojiAnimFillPositiveThreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
