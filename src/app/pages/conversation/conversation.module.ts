import { effect, NgModule } from '@angular/core';

import { ConversationRoutingModule } from './conversation-routing.module';
import { ConversationComponent } from './layout/conversation.component';
import { ConversationDetailComponent } from './conversation-detail/conversation-detail.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { TipsModule } from 'src/app/shared/components/tips/tips.module';
import { PaymentCounterModule } from 'src/app/shared/components/payment-counter/payment-counter.module';
import { MeetingConfirmationComponent } from './meeting-confirmation/meeting-confirmation.component';
import { MeetingFeedbackComponent } from './meeting-feedback/meeting-feedback.component';
import { NouisliderModule } from 'ng2-nouislider';
import { SliderModule } from 'src/app/shared/components/slider/slider.module';
import { ReceiptModule } from 'src/app/shared/components/receipt/receipt.module';
import { PriceSliderModule } from './price-slider/price-slider.module';
import { EditIceBreakerModule } from 'src/app/ice-breaker/modules/ice-breaker-template/components/edit-ice-breaker/edit-ice-breaker.module';
import { ShouldShowMessagePipe } from './pipes/should-show-message.pipe';
import { IsPreviewIcebreakerMessageModule } from './pipes/is-preview-icebreaker-messge/is-preview-icebreaker-message.module';
import { ScrollBtnModule } from '../../shared/components/scroll-btn/scroll-btn.module';
import { AddingUserComponent } from './components/adding-user/adding-user.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { DollarIconComponent } from '../../shared/icons/dollar-icon/dollar-icon.component';
import { ScannerIconComponent } from 'src/app/shared/icons/scanner-icon/scanner-icon.component';
import { FileIconComponent } from 'src/app/shared/icons/file-icon/file-icon.component';
import { CameraIconComponent } from 'src/app/shared/icons/camera-icon/camera-icon.component';
import { LocationIconComponent } from 'src/app/shared/icons/location-icon/location-icon.component';
import { PillIconComponent } from 'src/app/shared/icons/pill-icon/pill-icon.component';
import { ImageIconComponent } from 'src/app/shared/icons/image-icon/image-icon.component';
import { ContactIconComponent } from 'src/app/shared/icons/contact-icon/contact-icon.component';
import { CloseIconComponent } from 'src/app/shared/icons/close-icon/close-icon.component';
import { SendIconComponent } from 'src/app/shared/icons/send-icon/send-icon.component';
import { AdditionalMenuComponent } from './components/additional-menu/additional-menu.component';
import { ConversationUsersComponent } from '../../shared/components/conversation-users/conversation-users.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { createForChildProviderConfig } from '../../shared/app-language/translate-module-provider-config.factory';
import { LanguageService } from '../../services/language.service';
import { NgOptimizedImage } from '@angular/common';
import { ConversationManagePanelComponent } from './components/conversation-manage-panel/conversation-manage-panel.component';
import { UploadIconComponent } from '../../shared/icons/upload-icon/upload-icon.component';
import { TrendsIconComponent } from '../../shared/icons/trends-icon/trends-icon.component';
import { MessageIconComponent } from '../../shared/icons/message-icon/message-icon.component';
import { ActivityIconComponent } from '../../shared/icons/activity-icon/activity-icon.component';
import { InternalChatHeaderComponent } from './components/internal-chat-header/internal-chat-header.component';
import { AddUserIconComponent } from '../../shared/icons/add-user-icon/add-user-icon.component';
import { TaskIconComponent } from '../../shared/icons/task-icon/task-icon.component';
import { SidebarShrinkComponent } from '../../shared/icons/sidebar-shrink/sidebar-shrink.component';
import { DropdownListComponent } from '../../shared/complex-ui-components/dropdown-list/dropdown-list.component';
import { ButtonComponent } from '../../shared/UIkit/button/button.component';
import { RequestIconComponent } from '../../shared/icons/request-icon/request-icon.component';
import { IconMoreVerticalComponent } from '../../shared/icons/icon-more-vertical/icon-more-vertical.component';
import { FinishQuestionnaireButtonComponent } from './components/finish-questionnaire-button/finish-questionnaire-button.component';
import { CompleteFlagIconComponent } from '../../shared/icons/complete-flag-icon/complete-flag-icon.component';
import { CheckIconComponent } from '../../shared/icons/check-icon/check-icon.component';
import { RightArrowIconComponent } from '../../shared/icons/right-arrow-icon/right-arrow-icon.component';
import { IcebreakerConversationActionsComponent } from './components/icebreaker-conversation-actions/icebreaker-conversation-actions.component';
import { LupaiIconComponent } from '../../shared/icons/lupai-icon/lupai-icon.component';
import { IconHashComponent } from '../../shared/icons/icon-hash/icon-hash.component';
import { IconEventsComponent } from '../../shared/icons/icon-events/icon-events.component';
import { IconClipboardComponent } from '../../shared/icons/icon-clipboard/icon-clipboard.component';
import { MockWrapComponent } from './components/mock-wrap/mock-wrap.component';
import { createSkillApiUrlsProvider } from '../../services/skill/skill-api-urls.provider';
import { ConversationMenuItemComponent } from './components/conversation-menu-item/conversation-menu-item.component';
import { ArrowDownIconComponent } from '../../shared/icons/arrow-down-icon/arrow-down-icon.component';
import { IconArrowComponent } from '../../shared/icons/icon-arrow/icon-arrow.component';
import { MobileMenuComponent } from './components/mobile-menu/mobile-menu.component';
import { IconRenderComponent } from '../../shared/icons/_base/icon-render/icon-render.component';
import { DropdownListItemComponent } from '../../shared/UIkit/dropdown-list-item/dropdown-list-item.component';
import { ConversationMobileMenuViewService } from './providers/conversation-mobile-menu-view.service';
import { NextStepComponent } from '../../shared/components/next-step/next-step.component';
import { IconLongArrowComponent } from '../../shared/icons/icon-long-arrow/icon-long-arrow.component';
import { IconFinishComponent } from '../../shared/icons/icon-finish/icon-finish.component';
import { LoginProposalComponent } from '../../shared/components/login-proposal/login-proposal.component';
import { MobileConversationComponent } from './components/mobile-conversation/mobile-conversation.component';

@NgModule({
  declarations: [
    ConversationComponent,
    MeetingFeedbackComponent,
    AddingUserComponent,
  ],
  providers: [
    createSkillApiUrlsProvider({ GET: 'skills/' }),
    ConversationMobileMenuViewService,
  ],
  imports: [
    ShouldShowMessagePipe,
    FinishQuestionnaireButtonComponent,
    IcebreakerConversationActionsComponent,
    InternalChatHeaderComponent,
    MobileMenuComponent,
    MockWrapComponent,
    SharedModule,
    ConversationRoutingModule,
    TipsModule,
    PaymentCounterModule,
    NouisliderModule,
    SliderModule,
    ReceiptModule,
    PriceSliderModule,
    EditIceBreakerModule,
    IsPreviewIcebreakerMessageModule,
    ScrollBtnModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    DollarIconComponent,
    ImageIconComponent,
    ScannerIconComponent,
    FileIconComponent,
    CameraIconComponent,
    LocationIconComponent,
    PillIconComponent,
    ContactIconComponent,
    CloseIconComponent,
    SendIconComponent,
    AdditionalMenuComponent,
    ConversationUsersComponent,
    TranslateModule.forChild(createForChildProviderConfig('conversation')),
    NgOptimizedImage,
    DropdownListComponent,
    ButtonComponent,
    RequestIconComponent,
    IconMoreVerticalComponent,
    UploadIconComponent,
    TrendsIconComponent,
    MessageIconComponent,
    ActivityIconComponent,
    AddUserIconComponent,
    TaskIconComponent,
    ButtonComponent,
    SidebarShrinkComponent,
    CompleteFlagIconComponent,
    CheckIconComponent,
    RightArrowIconComponent,
    LupaiIconComponent,
    IconHashComponent,
    IconEventsComponent,
    IconClipboardComponent,
    ConversationMenuItemComponent,
    ArrowDownIconComponent,
    IconArrowComponent,
    IconRenderComponent,
    DropdownListItemComponent,
    NextStepComponent,
    IconLongArrowComponent,
    IconFinishComponent,
    LoginProposalComponent,
    ConversationDetailComponent,
    MobileConversationComponent,
    ConversationManagePanelComponent,
  ],
  exports: [
    ConversationDetailComponent,
    IcebreakerConversationActionsComponent,
    FinishQuestionnaireButtonComponent,
    ShouldShowMessagePipe,
    InternalChatHeaderComponent,
    MeetingFeedbackComponent,
  ],
})
export class ConversationModule {
  constructor(
    private readonly _languageService: LanguageService,
    private readonly _translateService: TranslateService,
  ) {
    effect(() => {
      this._translateService.use(this._languageService.currentLanguageCode());
    });
  }
}
