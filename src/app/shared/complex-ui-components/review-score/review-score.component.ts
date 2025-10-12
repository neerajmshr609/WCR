import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MeterComponent } from '../meter/meter.component';
import { Rgba } from '@helpers-lib/rgba';
import { ArrowLeftCircleIconComponent } from '@icons/arrow-left-circle-icon/arrow-left-circle-icon.component';
import { ArrowRightCircleIconComponent } from '@icons/arrow-right-circle-icon/arrow-right-circle-icon.component';
import { TranslateModule } from '@ngx-translate/core';
import { IconEmojiAnimFillNoRatingComponent } from '@icons/icon-emoji-anim-fill-no-rating/icon-emoji-anim-fill-no-rating.component';
import { IconRenderComponent } from '@icons/_base/icon-render/icon-render.component';
import { IconEmojiAnimFillNegativeFourComponent } from '@icons/icon-emoji-anim-fill-negative-four/icon-emoji-anim-fill-negative-four.component';
import { IconEmojiAnimFillNegativeThreeComponent } from '@icons/icon-emoji-anim-fill-negative-three/icon-emoji-anim-fill-negative-three.component';
import { IconEmojiAnimFillNegativeTwoComponent } from '@icons/icon-emoji-anim-fill-negative-two/icon-emoji-anim-fill-negative-two.component';
import { IconEmojiAnimFillNegativeOneComponent } from '@icons/icon-emoji-anim-fill-negative-one/icon-emoji-anim-fill-negative-one.component';
import { IconEmojiAnimFillNegativeZeroComponent } from '@icons/icon-emoji-anim-fill-negative-zero/icon-emoji-anim-fill-negative-zero.component';
import { IconEmojiAnimFillPositiveZeroComponent } from '@icons/icon-emoji-anim-fill-positive-zero/icon-emoji-anim-fill-positive-zero.component';
import { IconEmojiAnimFillPositiveOneComponent } from '@icons/icon-emoji-anim-fill-positive-one/icon-emoji-anim-fill-positive-one.component';
import { IconEmojiAnimFillPositiveTwoComponent } from '@icons/icon-emoji-anim-fill-positive-two/icon-emoji-anim-fill-positive-two.component';
import { IconEmojiAnimFillPositiveThreeComponent } from '@icons/icon-emoji-anim-fill-positive-three/icon-emoji-anim-fill-positive-three.component';
import { IconEmojiAnimFillPositiveFourComponent } from '@icons/icon-emoji-anim-fill-positive-four/icon-emoji-anim-fill-positive-four.component';

@Component({
  selector: 'app-review-score',
  standalone: true,
  imports: [
    CommonModule,
    MeterComponent,
    ArrowLeftCircleIconComponent,
    ArrowRightCircleIconComponent,
    TranslateModule,
    IconEmojiAnimFillNoRatingComponent,
    IconRenderComponent,
  ],
  templateUrl: './review-score.component.html',
  styleUrls: ['./review-score.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewScoreComponent {
  readonly score = input<number | null>(null);
  readonly maxScore = input<number | null>(null);
  readonly totalReviews = input<number | null>(null);

  readonly allowPositiveReview = input<boolean>(true);
  readonly allowNegativeReview = input<boolean>(true);
  readonly review = output<boolean>();

  readonly hasReviews = computed(() => typeof this.totalReviews() === 'number');

  readonly rotateCoefficient = computed(() => {
    const score = this.score();
    const maxScore = this.maxScore();
    return maxScore !== null && score !== null
      ? (score % maxScore) / maxScore
      : null;
  });

  private readonly _colors = [
    new Rgba(217, 89, 60),
    new Rgba(231, 137, 97),
    new Rgba(209, 159, 112),
    new Rgba(224, 188, 118),
    new Rgba(201, 193, 161),
    new Rgba(201, 193, 161),
    new Rgba(227, 190, 48),
    new Rgba(214, 217, 89),
    new Rgba(181, 212, 114),
    new Rgba(137, 212, 167),
    new Rgba(0, 198, 126),
  ] as const;

  private readonly _marks = [
    '-4.5',
    '-3.5',
    '-2.5',
    '-1.5',
    '-0.5',
    '0.0',
    '+0.5',
    '+1.5',
    '+2.5',
    '+3.5',
    '+4.5',
  ] as const;

  private readonly _emojiIcons = [
    IconEmojiAnimFillNegativeFourComponent,
    IconEmojiAnimFillNegativeThreeComponent,
    IconEmojiAnimFillNegativeTwoComponent,
    IconEmojiAnimFillNegativeOneComponent,
    IconEmojiAnimFillNegativeZeroComponent,
    IconEmojiAnimFillNoRatingComponent,
    IconEmojiAnimFillPositiveZeroComponent,
    IconEmojiAnimFillPositiveOneComponent,
    IconEmojiAnimFillPositiveTwoComponent,
    IconEmojiAnimFillPositiveThreeComponent,
    IconEmojiAnimFillPositiveFourComponent,
  ];

  readonly currentColor = computed(() => {
    let color = '#B0B0B0';
    const coefficient = this.rotateCoefficient();
    if (coefficient !== null) {
      const colorIndex = Math.round((this._colors.length - 1) * coefficient);
      if (colorIndex === this._colors.length - 1) {
        color = this._colors[colorIndex].toCss();
      } else {
        const colorCoefficient =
          coefficient - colorIndex / (this._colors.length - 1);
        color = Rgba.findBetween(
          this._colors[colorIndex],
          this._colors[colorIndex + 1],
          colorCoefficient,
        ).toCss();
      }
    }
    return color;
  });

  readonly currentMark = computed(() => {
    let mark = '_._';
    const coefficient = this.rotateCoefficient();
    if (coefficient !== null) {
      const markIndex = Math.round((this._marks.length - 1) * coefficient);
      mark = this._marks[markIndex];
    }
    return mark;
  });

  readonly currentEmoji = computed(() => {
    let icon = IconEmojiAnimFillNoRatingComponent;
    const coefficient = this.rotateCoefficient();
    if (coefficient !== null) {
      const emojiIndex = Math.round(
        (this._emojiIcons.length - 1) * coefficient,
      );
      icon = this._emojiIcons[emojiIndex];
    }
    return { icon };
  });

  readonly arrowDefaultColor = '#B3B3B3';
  readonly arrowActiveColor = '#1E1E1E';

  positiveReview() {
    if (this.allowPositiveReview()) {
      this.review.emit(true);
    }
  }

  negativeReview() {
    if (this.allowNegativeReview()) {
      this.review.emit(false);
    }
  }
}
