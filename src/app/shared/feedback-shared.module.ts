import { NgModule } from '@angular/core';
import { SharedModule } from './shared.module';
import { RouterModule } from '@angular/router';
import { DragSliderModalComponent } from '../pages/rateflow/drag-slider-modal/drag-slider-modal.component';
import { DrawDialogComponent } from '../pages/rateflow/draw/draw-dialog/draw-dialog.component';
import { DrawComponent } from '../pages/rateflow/draw/draw.component';
import { AvPaneComponent } from '../pages/rateflow/flexfeedback/av-pane/av-pane.component';
import { CommentFieldComponent } from '../pages/rateflow/flexfeedback/comment-field/comment-field.component';
import { FlexfeedbackComponent } from '../pages/rateflow/flexfeedback/flexfeedback.component';
import { InfoPaneComponent } from '../pages/rateflow/flexfeedback/info-pane/info-pane.component';
import { InspiringrateModalComponent } from '../pages/rateflow/flexfeedback/inspiringrate-modal/inspiringrate-modal.component';
import { PresenterQuestionsPaneItemComponent } from '../pages/rateflow/flexfeedback/presenter-questions-pane/presenter-questions-pane-item/presenter-questions-pane-item.component';
// tslint:disable-next-line: max-line-length
import { PresenterQuestionsPaneComponent } from '../pages/rateflow/flexfeedback/presenter-questions-pane/presenter-questions-pane.component';
import { ScreenshotModalComponent } from '../pages/rateflow/flexfeedback/screenshot-modal/screenshot-modal.component';
import { UrlModalComponent } from '../pages/rateflow/flexfeedback/url-modal/url-modal.component';
import { ResortPresentationComponent } from '../pages/rateflow/resort-presentation/resort-presentation.component';
import { SkipComponent } from '../pages/rateflow/skip/skip.component';
import { AvRatingSliderComponent } from '../pages/rateflow/av-rating-slider/av-rating-slider.component';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { PaymentCounterModule } from './components/payment-counter/payment-counter.module';
import { SliderModule } from './components/slider/slider.module';
import { SortablejsModule } from 'ngx-sortablejs-v16';
import { ButtonComponent } from './UIkit/button/button.component';
import { IconAudioRecordComponent } from './icons/icon-audio-record/icon-audio-record.component';
import { SendIconComponent } from './icons/send-icon/send-icon.component';
import { CloseCardIconComponent } from './icons/close-card-icon/close-card-icon.component';
import { TranslateModule } from '@ngx-translate/core';
import { AudioIconComponent } from './icons/audio-icon/audio-icon.component';

@NgModule({
  declarations: [
    DrawComponent,
    FlexfeedbackComponent,
    PresenterQuestionsPaneComponent,
    PresenterQuestionsPaneItemComponent,
    InfoPaneComponent,
    SkipComponent,
    ResortPresentationComponent,
    AvPaneComponent,
    CommentFieldComponent,
    DrawDialogComponent,
    InspiringrateModalComponent,
    UrlModalComponent,
    DragSliderModalComponent,
    ScreenshotModalComponent,
    AvRatingSliderComponent,
  ],
  imports: [
    SharedModule,
    SortablejsModule,
    RouterModule,
    NgxSliderModule,
    PaymentCounterModule,
    SliderModule,
    ButtonComponent,
    IconAudioRecordComponent,
    SendIconComponent,
    CloseCardIconComponent,
    TranslateModule,
    AudioIconComponent,
  ],
  exports: [
    InfoPaneComponent,
    FlexfeedbackComponent,
    PresenterQuestionsPaneComponent,
    PresenterQuestionsPaneItemComponent,
    SkipComponent,
    AvPaneComponent,
    DrawComponent,
    ResortPresentationComponent,
    CommentFieldComponent,
    DrawDialogComponent,
    InspiringrateModalComponent,
    UrlModalComponent,
    DragSliderModalComponent,
    ScreenshotModalComponent,
    AvRatingSliderComponent,
    NgxSliderModule,
    PaymentCounterModule,
    SliderModule,
  ],
})
export class FeedbackSharedModule {}
