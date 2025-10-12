import { NgModule } from '@angular/core';

import { MaterialModule } from './modules/material.module';
import { PipesModule } from './pipes/pipes.module';
import { DirectivesModule } from './directives/directives.module';
import { CoreModule } from './modules/core.module';
import { CdkModule } from './modules/cdk.module';

import { MomentModule } from 'ngx-moment';
import { ClipboardModule } from 'ngx-clipboard';
import { ImageCropperModule } from 'ngx-image-cropper';
import { NgxCaptureModule } from 'ngx-capture';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { PdfViewerModule } from 'ng2-pdf-viewer';

import { MomentTimezonePickerModule } from 'moment-timezone-picker';

import { ItemMediaViewComponent } from './components/item-media-view/item-media-view.component';
// tslint:disable-next-line:max-line-length
import { GtSwitchComponent } from './components/gt-switch/gt-switch.component';
import { UserInfoComponent } from './components/user-info/user-info.component';
import { CrystalLightboxModule } from '../vendor/lightbox/lib/lightbox.module';
import { ProjectInfoCardsComponent } from './components/project-info-cards/project-info-cards.component';
// tslint:disable-next-line: max-line-length
import { ProjectInfoCardSingleComponent } from './components/project-info-cards/project-info-card-single/project-info-card-single.component';
import { SignUpMessageComponent } from './components/sign-up-message/sign-up-message.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { HelpnavigationComponent } from './components/helpnavigation/helpnavigation.component';
import { MessageComponent } from './components/message/message.component';
import { OnboardingModalComponent } from './components/onboarding-modal/onboarding-modal.component';
import { FifthCardComponent } from './components/onboarding-modal/fifth-card/fifth-card.component';
import { FirstCardComponent } from './components/onboarding-modal/first-card/first-card.component';
import { FourthCardComponent } from './components/onboarding-modal/fourth-card/fourth-card.component';
import { SecondCardComponent } from './components/onboarding-modal/second-card/second-card.component';
import { ThirdCardComponent } from './components/onboarding-modal/third-card/third-card.component';
import { SixthCardComponent } from './components/onboarding-modal/sixth-card/sixth-card.component';
import { FilePreviewOverlayComponent } from './components/file-preview/file-preview-overlay.component';
import { CropImageComponent } from './components/crop-image/crop-image.component';
import { PreviewIframeModalComponent } from './components/iframe/preview-iframe-modal/preview-iframe-modal.component';
import { PresentationSliderComponent } from './components/presentation-slider/presentation-slider.component';
import { IframePresentationComponent } from './components/iframe/iframe-presentation/iframe-presentation.component';
import { LoadIframeBtnComponent } from './components/iframe/load-iframe-btn/load-iframe-btn.component';
import { ScreenshotOverlayComponent } from './components/screenshot/screenshot-overlay/screenshot-overlay.component';
import { ScreenshotFullViewComponent } from './components/screenshot/screenshot-full-view/screenshot-full-view.component';
import { GridPresentationPlaceholderComponent } from './components/grid-presentation/grid-presentation-placeholder/grid-presentation-placeholder.component';
import { RoundSliderComponent } from './components/round-slider/round-slider.component';
import { PdfPresentationComponent } from './components/pdf/pdf-presentation/pdf-presentation.component';
import { LoadPdfBtnComponent } from './components/pdf/load-pdf-btn/load-pdf-btn.component';
import { PreviewPdfModalComponent } from './components/pdf/preview-pdf-modal/preview-pdf-modal.component';
import {
  MetaLoader,
  MetaModule,
  MetaStaticLoader,
  PageTitlePositioning,
} from '@ngx-meta/core';
import { ProjectCardV2Component } from './components/project-card-v2/project-card-v2.component';
import { AudioMessageComponent } from './components/audio-message/audio-message.component';
import { AudioRecordComponent } from './components/audio-record/audio-record.component';
import { ComingSoonComponent } from './components/coming-soon/coming-soon.component';
import { CurvesComponent } from './components/curves/curves.component';
import { FeedbackFocusAreaComponent } from './components/feedback-focus-area/feedback-focus-area.component';
import { ModalComponent } from './components/modal/modal.component';
import { TextInputComponent } from './components/text-input/text-input.component';
import { HeartComponent } from './components/heart/heart.component';
import { DummyFileComponent } from './components/dummy-file/dummy-file.component';
import { DummyHowToUseComponent } from './components/dummy-file/dummy-how-to-use/dummy-how-to-use.component';
import { DummyExplainerComponent } from './components/dummy-file/dummy-explainer/dummy-explainer.component';
import { FeedbackSelectorComponent } from './components/feedback-selector/feedback-selector.component';
import { FileInfoComponent } from './components/file-info/file-info.component';
import { StripeBankCardFormComponent } from './components/stripe-bank-card-form/stripe-bank-card-form.component';
import { GoeyFooterComponent } from './components/goey-footer/goey-footer.component';
import { FeedbackBubbleComponent } from './components/feedback-bubble/feedback-bubble.component';
import { RatebackSelectorComponent } from './components/rateback-selector/rateback-selector.component';
import { GridPresentationComponent } from './components/grid-presentation/grid-presentation.component';
import { LogoErrorModalComponent } from './modules/header/logo-error-modal/logo-error-modal.component';
import { SearchBarCategoriesComponent } from './components/search-bar/search-bar-categories/search-bar-categories.component';
import { SearchBarSkillsComponent } from './components/search-bar/search-bar-skills/search-bar-skills.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { SearchResultsCategoriesComponent } from './components/search-results/search-results-categories/search-results-categories.component';
import { SearchResultsSkillsComponent } from './components/search-results/search-results-skills/search-results-skills.component';
import { SearchResultsComponent } from './components/search-results/search-results.component';

import { AdvisorInfoCardComponent } from '../pages/newsfeed/advisor-info-card/advisor-info-card.component';
import { ItemCtbMediaViewComponent } from '../pages/newsfeed/newsfeed-item/item-ctb-media-view/item-ctb-media-view.component';
import { ItemResortViewComponent } from '../pages/newsfeed/newsfeed-item/item-resort-view/item-resort-view.component';
import { NewsfeedAvpresentationVideoComponent } from '../pages/newsfeed/newsfeed-item/newsfeed-avpresentation-video/newsfeed-avpresentation-video.component';
import { NewsfeedAvpresentationComponent } from '../pages/newsfeed/newsfeed-item/newsfeed-avpresentation/newsfeed-avpresentation.component';
import { NewsfeedItemComponent } from '../pages/newsfeed/newsfeed-item/newsfeed-item.component';
// import { ProfileInfoCardComponent } from '../pages/profile/components/profile-info/_profile-info-card/profile-info-card.component';
import { AvpresentationVideoComponent } from '../pages/rateflow/avpresentation-video/avpresentation-video.component';
import { AvpresentationComponent } from '../pages/rateflow/avpresentation/avpresentation.component';
import { OnboardingPresentationComponent } from '../pages/rateflow/onboarding-presentation/onboarding-presentation.component';
import { SmallSpinnerModule } from './components/small-spinner/small-spinner.module';
import { ContentEditableFieldModule } from './components/content-editable-field/content-editable-field.module';
import { BankCardFormModalComponent } from './components/bank-card-form-modal/bank-card-form-modal.component';
import { UserAvatarModule } from './components/user-info/pipes/user-avatar/user-avatar.module';
import { IsPreviewIcebreakerMessageModule } from '../pages/conversation/pipes/is-preview-icebreaker-messge/is-preview-icebreaker-message.module';
import { TranslateModule } from '@ngx-translate/core';
import { IvyCarouselModule } from 'angular-responsive-carousel-ng16';
import { PlyrModule } from 'ngx-plyr-mg';
import { NgsContenteditableModule } from '@ng-stack/contenteditable';
import { ScrollDownBtnComponent } from './components/scroll-down-btn/scroll-down-btn.component';
import { PlusIconComponent } from './icons/plus-icon/plus-icon.component';
import { ViewFileComponent } from './components/view-file/view-file.component';
import { CloseIconComponent } from './icons/close-icon/close-icon.component';
import { DownloadIconComponent } from './icons/download-icon/download-icon.component';
import { ArrowDownIconComponent } from './icons/arrow-down-icon/arrow-down-icon.component';
import { TrashIconComponent } from './icons/trash-icon/trash-icon.component';
import { AccountInfoIconComponent } from './icons/account-info-icon/account-info-icon.component';
import { UploadBtnIconComponent } from './icons/upload-btn-icon/upload-btn-icon.component';
import { LockIconComponent } from './icons/lock-icon/lock-icon.component';
import { NotificationBellIconComponent } from './icons/notification-bell-icon/notification-bell-icon.component';
import { ChevronDownIconComponent } from './icons/chevron-down-icon/chevron-down-icon.component';
import { SecurePaymentIconComponent } from './icons/secure-payment-icon/secure-payment-icon.component';
import { SkillsToolsIconComponent } from './icons/skills-tools-icon/skills-tools-icon.component';
import { SearchIconComponent } from './icons/search-icon/search-icon.component';
import { DragHandleIconComponent } from './icons/drag-handle-icon/drag-handle-icon.component';
import { FilterIconComponent } from './icons/filter-icon/filter-icon.component';
import { LanguageIconComponent } from './icons/language-icon/language-icon.component';
import { TopicsIconComponent } from './icons/topics-icon/topics-icon.component';
import { MailIconComponent } from './icons/mail-icon/mail-icon.component';
import { OrganizationIconComponent } from './icons/organization-icon/organization-icon.component';
import { ReorderIconComponent } from './icons/reorder-icon/reorder-icon.component';
import { ImageIconComponent } from './icons/image-icon/image-icon.component';
import { BellIconComponent } from './icons/bell-icon/bell-icon.component';
import { CloseCardIconComponent } from './icons/close-card-icon/close-card-icon.component';
import { ChatConfirmationPanelComponent } from './components/chat-confirmation-panel/chat-confirmation-panel.component';
import { CheckIconComponent } from './icons/check-icon/check-icon.component';
import { CancelIconComponent } from './icons/cancel-icon/cancel-icon.component';
import { ImageUploaderComponent } from './complex-ui-components/image-uploader/image-uploader.component';
import { AudioIconComponent } from './icons/audio-icon/audio-icon.component';
import { ServiceMessageComponent } from './model-based-components/conversation-messages/service-message/service-message.component';
import { DefaultMessageComponent } from './model-based-components/conversation-messages/default-message/default-message.component';
import { YesNoQuestionReplyComponent } from './model-based-components/conversation-messages/reply-messages/yes-no-question-reply/yes-no-question-reply.component';
import { NoXIconComponent } from './icons/no-x-icon/no-x-icon.component';
import { UserAddRemoveMessageComponent } from './model-based-components/conversation-messages/user-add-remove-message/user-add-remove-message.component';
import { NgPipesModule } from 'ngx-pipes';
import { SponsorBoxComponent } from './components/sponsor-box/sponsor-box.component';
import { ButtonComponent } from './UIkit/button/button.component';
import { IconPlayComponent } from './icons/icon-play/icon-play.component';
import { IconCancelBorderedComponent } from './icons/icon-cancel-bordered/icon-cancel-bordered.component';
import { IconStopComponent } from './icons/icon-stop/icon-stop.component';
import { IconAudioRecordComponent } from './icons/icon-audio-record/icon-audio-record.component';
import { SendIconComponent } from './icons/send-icon/send-icon.component';
import { IconArrowComponent } from './icons/icon-arrow/icon-arrow.component';
import { IframelyEmbedModule } from '../ice-breaker/modules/ice-breakers-list-old/ice-breaker-card-module/components/iframely-embed/iframely-embed.module';
import { GetIframeModule } from '../ice-breaker/modules/ice-breakers-list-old/ice-breaker-card-module/components/ice-breaker-card/pipes/get-iframe/get-iframe.module';
import { VideoCallInviteComponent } from './model-based-components/conversation-messages/video-call-invite/video-call-invite.component';
import { FeedBackMessageComponent } from './model-based-components/conversation-messages/feed-back-message/feed-back-message.component';
import { IconBriefComponent } from '@icons/icon-brief/icon-brief.component';

@NgModule({
  declarations: [
    ProjectInfoCardSingleComponent,
    ProjectInfoCardsComponent,
    NewsfeedItemComponent,
    AdvisorInfoCardComponent,
    ProjectCardV2Component,
    ItemResortViewComponent,
    GtSwitchComponent,
    PresentationSliderComponent,
    OnboardingPresentationComponent,
    ModalComponent,
    MessageComponent,
    AvpresentationComponent,
    NewsfeedAvpresentationComponent,
    GridPresentationComponent,
    AvpresentationVideoComponent,
    FilePreviewOverlayComponent,
    ItemMediaViewComponent,
    NewsfeedAvpresentationVideoComponent,
    UserInfoComponent,
    ItemCtbMediaViewComponent,
    // ProfileInfoCardComponent,
    SignUpMessageComponent,
    HelpnavigationComponent,
    OnboardingModalComponent,
    FirstCardComponent,
    SecondCardComponent,
    ThirdCardComponent,
    FourthCardComponent,
    FifthCardComponent,
    SixthCardComponent,
    ConfirmDialogComponent,
    CropImageComponent,
    IframePresentationComponent,
    PreviewIframeModalComponent,
    LoadIframeBtnComponent,
    ScreenshotOverlayComponent,
    ScreenshotFullViewComponent,
    GridPresentationPlaceholderComponent,
    RoundSliderComponent,
    PdfPresentationComponent,
    LoadPdfBtnComponent,
    PreviewPdfModalComponent,
    AudioMessageComponent,
    AudioRecordComponent,
    ComingSoonComponent,
    CurvesComponent,
    TextInputComponent,
    FeedbackFocusAreaComponent,
    HeartComponent,
    DummyFileComponent,
    DummyHowToUseComponent,
    FileInfoComponent,
    FeedbackSelectorComponent,
    StripeBankCardFormComponent,
    GoeyFooterComponent,
    FeedbackBubbleComponent,
    RatebackSelectorComponent,
    DummyExplainerComponent,
    SearchBarComponent,
    SearchBarCategoriesComponent,
    SearchBarSkillsComponent,
    SearchResultsComponent,
    SearchResultsCategoriesComponent,
    SearchResultsSkillsComponent,
    LogoErrorModalComponent,
    BankCardFormModalComponent,
    ViewFileComponent,
    ScrollDownBtnComponent,
    ChatConfirmationPanelComponent,
    ServiceMessageComponent,
    DefaultMessageComponent,
    YesNoQuestionReplyComponent,
  ],
  imports: [
    CoreModule,
    CdkModule,
    MomentTimezonePickerModule,
    PlyrModule,
    NgsContenteditableModule,
    MomentModule,
    CrystalLightboxModule,
    ClipboardModule,
    IvyCarouselModule,
    ImageCropperModule,
    NgxCaptureModule,
    PdfViewerModule,
    MetaModule.forRoot({
      provide: MetaLoader,
      useFactory: metaFactory,
    }),
    DirectivesModule,
    InfiniteScrollDirective,
    MaterialModule,
    PipesModule,
    SmallSpinnerModule,
    ContentEditableFieldModule,
    UserAvatarModule,
    IframelyEmbedModule,
    GetIframeModule,
    IsPreviewIcebreakerMessageModule,
    TranslateModule,
    PlusIconComponent,
    CloseIconComponent,
    DownloadIconComponent,
    TrashIconComponent,
    ImageIconComponent,
    ArrowDownIconComponent,
    AccountInfoIconComponent,
    UploadBtnIconComponent,
    LockIconComponent,
    NotificationBellIconComponent,
    ChevronDownIconComponent,
    SecurePaymentIconComponent,
    SkillsToolsIconComponent,
    SearchIconComponent,
    DragHandleIconComponent,
    FilterIconComponent,
    LanguageIconComponent,
    TopicsIconComponent,
    MailIconComponent,
    OrganizationIconComponent,
    ReorderIconComponent,
    BellIconComponent,
    CloseCardIconComponent,
    CheckIconComponent,
    CancelIconComponent,
    ImageUploaderComponent,
    AudioIconComponent,
    NoXIconComponent,
    UserAddRemoveMessageComponent,
    NgPipesModule,
    SponsorBoxComponent,
    ButtonComponent,
    IconPlayComponent,
    IconCancelBorderedComponent,
    IconStopComponent,
    IconAudioRecordComponent,
    SendIconComponent,
    IconArrowComponent,
    FeedBackMessageComponent,
    IconBriefComponent,
    VideoCallInviteComponent,
  ],
  exports: [
    CoreModule,
    CdkModule,
    ProjectInfoCardSingleComponent,
    ProjectInfoCardsComponent,
    NewsfeedItemComponent,
    ItemCtbMediaViewComponent,
    AdvisorInfoCardComponent,
    UserInfoComponent,
    ProjectCardV2Component,
    ItemResortViewComponent,
    GtSwitchComponent,
    NewsfeedAvpresentationVideoComponent,
    ItemMediaViewComponent,
    FilePreviewOverlayComponent,
    AvpresentationVideoComponent,
    NewsfeedAvpresentationComponent,
    AvpresentationComponent,
    PresentationSliderComponent,
    MomentTimezonePickerModule,
    OnboardingPresentationComponent,
    ModalComponent,
    MessageComponent,
    NgsContenteditableModule,
    ClipboardModule,
    // ProfileInfoCardComponent,
    GridPresentationComponent,
    SignUpMessageComponent,
    HelpnavigationComponent,
    OnboardingModalComponent,
    FirstCardComponent,
    SecondCardComponent,
    ThirdCardComponent,
    FourthCardComponent,
    FifthCardComponent,
    SixthCardComponent,
    IvyCarouselModule,
    ImageCropperModule,
    ConfirmDialogComponent,
    NgxCaptureModule,
    CropImageComponent,
    IframePresentationComponent,
    PreviewIframeModalComponent,
    LoadIframeBtnComponent,
    ScreenshotOverlayComponent,
    ScreenshotFullViewComponent,
    GridPresentationPlaceholderComponent,
    RoundSliderComponent,
    PdfPresentationComponent,
    LoadPdfBtnComponent,
    PreviewPdfModalComponent,
    MetaModule,
    AudioMessageComponent,
    AudioRecordComponent,
    PlyrModule,
    ComingSoonComponent,
    CurvesComponent,
    TextInputComponent,
    FeedbackFocusAreaComponent,
    HeartComponent,
    DummyFileComponent,
    DummyHowToUseComponent,
    FileInfoComponent,
    FeedbackSelectorComponent,
    StripeBankCardFormComponent,
    DirectivesModule,
    GoeyFooterComponent,
    FeedbackBubbleComponent,
    RatebackSelectorComponent,
    DummyExplainerComponent,
    SearchBarComponent,
    SearchBarCategoriesComponent,
    SearchBarSkillsComponent,
    SearchResultsComponent,
    SearchResultsCategoriesComponent,
    SearchResultsSkillsComponent,
    LogoErrorModalComponent,
    MaterialModule,
    PipesModule,
    SmallSpinnerModule,
    InfiniteScrollDirective,
    ViewFileComponent,
    CloseIconComponent,
    DownloadIconComponent,
    TrashIconComponent,
    ScrollDownBtnComponent,
    AccountInfoIconComponent,
    UploadBtnIconComponent,
    LockIconComponent,
    NotificationBellIconComponent,
    ChevronDownIconComponent,
    SecurePaymentIconComponent,
    SkillsToolsIconComponent,
    SearchIconComponent,
    DragHandleIconComponent,
    FilterIconComponent,
    LanguageIconComponent,
    TopicsIconComponent,
    MailIconComponent,
    OrganizationIconComponent,
    ReorderIconComponent,
    BellIconComponent,
    ChatConfirmationPanelComponent,
    ImageUploaderComponent,
    ServiceMessageComponent,
    DefaultMessageComponent,
  ],
})
export class SharedModule {}

export function metaFactory(): MetaLoader {
  return new MetaStaticLoader({
    pageTitlePositioning: PageTitlePositioning.PrependPageTitle,
    pageTitleSeparator: ' | ',
    applicationName: 'We Care Remote',
    defaults: {
      title: 'We Care Remote',
      description: 'From Care to Community',
      'og:image':
        'https://efwfileupload.s3-accelerate.amazonaws.com/favi/fbimage.png',
      'og:type': 'website',
      'og:locale': 'en_US',
    },
  });
}
