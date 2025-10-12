import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  OnInit,
  output,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import {
  Conversation,
  IConversationUserInfo,
} from '../../../../shared/models/conversation.model';
import { AuthService } from '../../../../auth/auth.service';
import { BaseComponent } from '../../../../shared/components/base.component';
import { takeUntil } from 'rxjs/operators';
import { User } from '../../../../shared/models/user.model';
import { returnConversationType } from '../../../../shared/functions/converstion-types-adapter';
import { OutletService } from '../../../../services/outlet.service';
import { ConversationUsersComponent } from '../../../../shared/components/conversation-users/conversation-users.component';
import { ConversationModule } from '../../conversation.module';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ConversationMenuComponent } from '../conversation-menu/conversation-menu.component';

@Component({
  selector: 'app-conversation-header',
  templateUrl: './conversation-header.component.html',
  styleUrls: ['./conversation-header.component.scss'],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ConversationUsersComponent,
    NgOptimizedImage,
    RouterLink,
    ConversationMenuComponent,
  ],
})
export class ConversationHeaderComponent
  extends BaseComponent
  implements OnInit
{
  constructor(
    private readonly _authService: AuthService,
    private readonly _outletService: OutletService,
  ) {
    super();
  }

  readonly conversation = input.required<Conversation>();
  readonly activeConversationRater = input<IConversationUserInfo>();
  readonly activeConversationPartners = input<IConversationUserInfo[]>([]);
  readonly isOwnerOfIceBreaker = input<boolean>(false);
  readonly paymentSessionOpened = input<boolean>();
  readonly isVideoCallRequested = input<boolean>(false);
  readonly closePaymentSession = output<void>();
  readonly onPriceChanged = output<number>();
  readonly requestVideoCall = output<void>();

  readonly currentUser = signal<User | null>(null);
  readonly isCurrentUserConversationRater = computed(() => {
    const currUserId = this.currentUser()?.id;
    const conversationRaterUserId = this.activeConversationRater()?.user_id;
    return (
      currUserId &&
      conversationRaterUserId &&
      currUserId === conversationRaterUserId
    );
  });
  readonly headerBackLinkQueryParam = computed(() => {
    return this.isCurrentUserConversationRater() ? 'my_advice' : 'my_works';
  });
  readonly members = computed(() => {
    return Array.isArray(this.conversation()?.members)
      ? this.conversation().members
      : [];
  });
  readonly firstActiveConversationPartner = computed(() => {
    const currUserId = this.currentUser()?.id;
    return (
      (currUserId &&
        this.activeConversationPartners().find(
          (_) => _.user_id !== currUserId,
        )) ||
      null
    );
  });
  readonly companionTypeName = input<string>('');

  ngOnInit(): void {
    this._subscribeOnAuthUser();
  }

  private _subscribeOnAuthUser() {
    this._authService.authorizedUser$
      .pipe(takeUntil(this.destroyed))
      .subscribe((user) => {
        this.currentUser.set(user || null);
      });
  }

  public convertType(conversation: Conversation) {
    return returnConversationType(conversation);
  }

  navigateBackClickHandler(): void {
    this.closePaymentSession.emit();
    this._outletService.navigateBack();
  }
}
