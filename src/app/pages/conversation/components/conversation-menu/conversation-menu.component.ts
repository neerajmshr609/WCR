import {
  ChangeDetectionStrategy,
  Component,
  computed,
  HostBinding,
  input,
  output,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import {
  Conversation,
  RequestType,
} from '../../../../shared/models/conversation.model';
import { IConversationMenuItem } from './conversation-menu-item.interface';
import { MatDialog } from '@angular/material/dialog';
import { IConfirmationMessage } from '../../../../shared/complex-ui-components/confirmation-message/confirmation-message.interface';
import { ConfirmationMessageComponent } from '../../../../shared/complex-ui-components/confirmation-message/confirmation-message.component';
import { filter, map, switchMap } from 'rxjs/operators';
import { ConversationsService } from '../../../../services/conversations.service';
import { AddingUserComponent } from '../adding-user/adding-user.component';
import { PermissionService } from '../../../../auth/service/permission.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { isArrayAndHasItems } from '../../../../shared/lib/array-helpers.lib';
import { AuthService } from '../../../../auth/auth.service';
import { AnonymousUser } from '../../../../shared/models/user/anonymous-user.model';
import { DropdownListComponent } from '../../../../shared/complex-ui-components/dropdown-list/dropdown-list.component';
import { ConversationRequestMoreButtonComponent } from '../conversation-request-more-button/conversation-request-more-button.component';
import { returnConversationType } from '../../../../shared/functions/converstion-types-adapter';
import {
  LANGUAGES_CODE_TYPE,
  LANGUAGES_TITLES,
} from 'src/app/shared/app-language/data';
import { ModalSelectComponent } from '@ui-components/modal-select/modal-select.component';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'app-conversation-menu',
  templateUrl: './conversation-menu.component.html',
  styleUrls: ['./conversation-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [DropdownListComponent, ConversationRequestMoreButtonComponent],
})
export class ConversationMenuComponent {
  @HostBinding('class')
  get classes() {
    return { hidden: !isArrayAndHasItems(this.menuItems()) };
  }

  constructor(
    private languageService: LanguageService,
    private readonly _dialog: MatDialog,
    private authService: AuthService,
    private readonly _conversationsService: ConversationsService,
    private readonly _permissionsService: PermissionService,
  ) {}
  readonly conversation = input.required<Conversation>();
  readonly isVideoCallRequested = input<boolean>(false);
  readonly requestVideoCall = output<void>();
  public isDisable = toSignal(
    this.authService.authorizedUser$.pipe(
      map(
        (authorizedUser) =>
          !authorizedUser || (authorizedUser as AnonymousUser).isAnonymous,
      ),
    ),
  );

  private readonly _isCounselor = toSignal(
    this._permissionsService.isCounselor$,
  );
  private currentUser = toSignal(this.authService.authorizedUser$);

  readonly languagesOptions = Object.values(LANGUAGES_TITLES).map((_) => ({
    name: _,
  }));
  readonly currentLanguageOption = computed(() => ({
    name: this.languageService.currentLanguageTitle(),
  }));

  private isIncludeInConversation = computed(() => {
    return this.conversation().members.some(
      (member) => member.user_id === this.currentUser()?.id,
    );
  });

  readonly isOpened = signal(false);

  private readonly _openRequestMenuItems = computed<IConversationMenuItem[]>(
    () => {
      const baseItems: IConversationMenuItem[] = [
        {
          title: 'conversation_menu.accept_case',
          param: 'accept',
          selectHandler: this._acceptCaseHandler,
          description: 'conversation_menu.accept_case_description',
          icon: 'assets/icons/take.svg',
        },
      ];

      if (this.isBelongConversation()) {
        baseItems.push({
          title: 'conversation_menu.reject_case',
          param: 'reject',
          description: 'conversation_menu.reject_case_description',
          selectHandler: this._rejectCaseHandler,
          icon: 'assets/icons/reject2.svg',
        });
      }

      // Only add escalate option for ORGANIZATION_DIRECT or CONSULT_DIRECT request types
      // Check if it's an OpenRequestConversation with the right request_type
      if (this.canEscalate()) {
        baseItems.push({
          title: 'conversation_menu.escalate_case',
          param: 'escalate',
          selectHandler: this._escalateCaseHandler,
          icon: 'assets/icons/share.svg',
        });
      }

      return baseItems;
    },
  );

  private readonly _defaultMenuItems = computed<IConversationMenuItem[]>(() => {
    const item = [
      {
        title: this.isVideoCallRequested()
          ? 'conversation_menu.video_call_requested'
          : 'conversation_menu.video_call_request',
        param: 'video_call',
        icon: 'assets/icons/video-camera.svg',
        icon_alt: 'conversation_menu.video_call_request_icon_alt',
        disabled: this.isVideoCallRequested(),
        selectHandler: this._requestVideoCall,
      },
      {
        title: 'conversation_menu.add_user_title',
        description: 'conversation_menu.add_user_description',
        param: 'add_user',
        icon: 'assets/icons/user-plus.svg',
        selectHandler: this._openAddUserPopup,
      },
      {
        title: 'conversation_menu.select_language_title',
        description: 'conversation_menu.select_language_description',
        param: 'select_language',
        icon: 'assets/icons/world.svg',
        selectHandler: this.openLanguageSelectModal,
      },
    ];
    if (
      returnConversationType(this.conversation()) === 'client_chat' &&
      this.isBelongConversation()
    ) {
      item.push({
        title: 'conversation_menu.reject_case',
        param: 'reject',
        description: 'conversation_menu.reject_case_description',
        selectHandler: this._rejectCaseHandler,
        icon: 'assets/icons/reject2.svg',
      });
    }
    return item;
  });

  readonly menuItems = computed(() => {
    const currentUserAsMember = this.conversation().members.find(
      (member) => member.user_id === this.currentUser().id,
    );
    return this.conversation().isOpenRequest()
      ? this._isCounselor() &&
        (!currentUserAsMember || currentUserAsMember?.user_role !== 'client')
        ? this._openRequestMenuItems()
        : []
      : this._defaultMenuItems();
  });

  private canEscalate() {
    return this.isOrganizationDirectRequest() || this.isConsultDirectRequest();
  }

  private isBelongConversation(): boolean {
    return (
      this.conversation().icebreaker_member?.owner_id ===
        this.currentUser()?.id || this.isIncludeInConversation()
    );
  }

  private isOrganizationDirectRequest() {
    const conversation = this.conversation();
    return (
      conversation.isOpenRequest() &&
      'request_type' in conversation &&
      conversation.request_type === RequestType.ORGANIZATION_DIRECT
    );
  }

  private isConsultDirectRequest() {
    const conversation = this.conversation();
    return (
      conversation.isOpenRequest() &&
      'request_type' in conversation &&
      conversation.request_type === RequestType.CONSULT_DIRECT
    );
  }

  private _acceptCaseHandler() {
    this._dialog
      .open(ConfirmationMessageComponent, {
        data: {
          title: 'confirmation_message.accept_case_title',
          message: 'confirmation_message.accept_case_message',
          question: 'confirmation_message.accept_case_question',
          confirm: 'confirmation_message.accept_case_btn',
          cancel: 'confirmation_message.cancel_btn',
        } as IConfirmationMessage,
      })
      .beforeClosed()
      .pipe(
        filter((_) => _),
        switchMap(() =>
          this._conversationsService.acceptOpenRequestCase(this.conversation()),
        ),
      )
      .subscribe((confirmDialog) => {
        this._conversationsService.needUpdateConversation();
      });
  }

  private _rejectCaseHandler() {
    this._dialog
      .open(ConfirmationMessageComponent, {
        data: {
          title: 'confirmation_message.reject_case_title',
          message: 'confirmation_message.reject_case_message',
          question: 'confirmation_message.reject_case_question',
          confirm: 'confirmation_message.reject_case_btn',
          cancel: 'confirmation_message.cancel_btn',
        } as IConfirmationMessage,
      })
      .beforeClosed()
      .pipe(
        filter((_) => _),
        switchMap(() =>
          this._conversationsService.rejectOpenRequestCase(this.conversation()),
        ),
      )
      .subscribe((confirmDialog) => {
        this._conversationsService.needUpdateConversation();
      });
  }

  private _escalateCaseHandler() {
    const dialog_message = this.isConsultDirectRequest()
      ? 'confirmation_message.escalate_case_message_organization'
      : 'confirmation_message.escalate_case_message_platform';
    this._dialog
      .open(ConfirmationMessageComponent, {
        data: {
          title: 'confirmation_message.escalate_case_title',
          message: dialog_message,
          question: 'confirmation_message.escalate_case_question',
          confirm: 'confirmation_message.escalate_case_btn',
          cancel: 'confirmation_message.cancel_btn',
        } as IConfirmationMessage,
      })
      .beforeClosed()
      .pipe(
        filter((_) => _),
        switchMap(() =>
          this._conversationsService.escalateOpenRequestCase(
            this.conversation(),
          ),
        ),
      )
      .subscribe();
  }

  private _requestVideoCall() {
    this.requestVideoCall.emit();
  }

  openLanguageSelectModal(): void {
    this._dialog
      .open(ModalSelectComponent, {
        data: {
          title: 'select-language-modal.title',
          label: 'select-language-modal.label',
          options: this.languagesOptions,
          preSelected: this.currentLanguageOption(),
          placeholder: 'select language',
          cancel_btn_text: 'select-language-modal.cancel_btn_text',
          save_btn_text: 'select-language-modal.save_btn_text',
        },
      })
      .afterClosed()
      .subscribe(({ name: languageTitle }) => {
        const lang = Object.entries(LANGUAGES_TITLES).find(
          ([, title]) => title === languageTitle,
        );
        if (isArrayAndHasItems(lang)) {
          this.languageService.setCurrentLanguage(
            lang[0] as LANGUAGES_CODE_TYPE,
          );
        }
      });
  }

  private _openAddUserPopup() {
    this._dialog.open(AddingUserComponent, {
      data: {
        conversation: this.conversation(),
        inviteTo: 'chat',
      },
    });
  }

  selectMenuItem(item: IConversationMenuItem) {
    this.closeMenu();
    item.selectHandler.call(this);
  }

  toggleMenu() {
    const currentState = this.isOpened();
    this.isOpened.set(!currentState);
  }

  closeMenu() {
    if (this.isOpened()) {
      this.isOpened.set(false);
    }
  }
}
