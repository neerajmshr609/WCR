import { NgModule } from '@angular/core';
import { FitTextDirective } from './fit-text.directive';
import { PaymentFrequencyColorDirective } from './payment-frequency-color.directive';
import { ScoreColorDirective } from './score-color.directive';
import { SmoothHeightDirective } from './smooth-height.directive';
import { ClickOutsideDirective } from './clickoutside.directive';
import { LoadMoreOnscrollDirective } from './load-more-onscroll.directive';
import { DomChangeDirective } from './dom-change.directive';
import { ScoreEmojiDirective } from './score-emoji.directive';
import { ScrollIntoViewDirective } from './scroll-into-view.directive';

@NgModule({
  declarations: [
    SmoothHeightDirective,
    FitTextDirective,
    ScoreColorDirective,
    PaymentFrequencyColorDirective,
    ClickOutsideDirective,
    LoadMoreOnscrollDirective,
    DomChangeDirective,
    ScoreEmojiDirective,
    ScrollIntoViewDirective,
  ],
  imports: [],
  exports: [
    SmoothHeightDirective,
    FitTextDirective,
    ScoreColorDirective,
    PaymentFrequencyColorDirective,
    ClickOutsideDirective,
    LoadMoreOnscrollDirective,
    DomChangeDirective,
    ScoreEmojiDirective,
    ScrollIntoViewDirective,
  ],
})
export class DirectivesModule {}
