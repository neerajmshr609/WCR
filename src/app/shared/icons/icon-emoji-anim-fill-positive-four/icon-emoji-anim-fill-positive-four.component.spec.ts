import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconEmojiAnimFillPositiveFourComponent } from './icon-emoji-anim-fill-positive-four.component';

describe('IconEmojiAnimFillPositiveFourComponent', () => {
  let component: IconEmojiAnimFillPositiveFourComponent;
  let fixture: ComponentFixture<IconEmojiAnimFillPositiveFourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconEmojiAnimFillPositiveFourComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IconEmojiAnimFillPositiveFourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
