import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
} from '@angular/core';
import { IceBreakerConversation } from '../../../../shared/models/conversation.model';
import { IceBreakerService } from '../../../../ice-breaker/service/ice-breaker.service';
import { AuthService } from '../../../../auth/auth.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { CONVERSATIONS_PATH } from '../../../conversations/conversations-routing.module';
import { TextInputComponent } from '../../../../shared/components/text-input/text-input.component';
import { AudioRecordComponent } from '../../../../shared/components/audio-record/audio-record.component';
import { NextStepComponent } from '../../../../shared/components/next-step/next-step.component';
import { IconLongArrowComponent } from '../../../../shared/icons/icon-long-arrow/icon-long-arrow.component';
import { TranslateModule } from '@ngx-translate/core';
import { IconFinishComponent } from '../../../../shared/icons/icon-finish/icon-finish.component';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-icebreaker-conversation-actions',
  templateUrl: './icebreaker-conversation-actions.component.html',
  styleUrls: ['./icebreaker-conversation-actions.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NextStepComponent,
    IconLongArrowComponent,
    TranslateModule,
    IconFinishComponent,
    NgClass,
  ],
})
export class IcebreakerConversationActionsComponent {
  readonly conversation = model<IceBreakerConversation>();
  public textInput = input<TextInputComponent>();
  public audioInput = input<AudioRecordComponent>();
  public readonly signedInUser = toSignal(this._authService.userIsSignedIn$);

  constructor(
    private readonly _iceBreakerService: IceBreakerService,
    private readonly _authService: AuthService,
  ) {}

  private _navigateToAuthPage() {
    this._authService.openSignUpForm({
      returnUrl: CONVERSATIONS_PATH,
      hide_company: true,
    });
  }

  nextIceBreakerQuestion(conversation: IceBreakerConversation): void {
    this.handledMessages();
    this._iceBreakerService
      .nexIcebreakerQuestion(conversation)
      .subscribe((updatedIceBreakerConversation) => {
        this.conversation.set(updatedIceBreakerConversation);
      });
  }

  completeIceBreaker(conversation: IceBreakerConversation): void {
    this.handledMessages();
    this._iceBreakerService
      .completeIcebreaker(conversation)
      .subscribe((completedIceBreakerConversation) => {
        this.conversation.set(completedIceBreakerConversation);
        this._authService.storeLastConversation(conversation);
      });
  }

  private handledMessages(): void {
    if (this.textInput()) {
      this.textInput().send();
    }
    if (this.audioInput()) {
      this.audioInput().stopAudioRecord(true);
    }
  }
}
