import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconEmojiAnimFillNegativeThreeComponent } from './icon-emoji-anim-fill-negative-three.component';

describe('IconEmojiAnimFillNegativeThreeComponent', () => {
  let component: IconEmojiAnimFillNegativeThreeComponent;
  let fixture: ComponentFixture<IconEmojiAnimFillNegativeThreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconEmojiAnimFillNegativeThreeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IconEmojiAnimFillNegativeThreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
