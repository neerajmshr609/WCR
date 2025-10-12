import {
  ChangeDetectionStrategy,
  Component,
  input,
  OnInit,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import {
  Conversation,
  createConversation,
  IConversationUserInfo,
} from '../../../../shared/models/conversation.model';
import { ConversationsService } from '../../../../services/conversations.service';
import { switchMap } from 'rxjs';
import { ChatStateService } from '../../../../services/chat-state.service';
import { map, takeUntil } from 'rxjs/operators';
import { User } from '../../../../shared/models/user.model';
import { PermissionService } from '../../../../auth/service/permission.service';
import { Permissions } from '../../../../auth/model/permissions.model';
import { ResizeService } from '../../../../services/resize.service';
import { BaseComponent } from '../../../../shared/components/base.component';
import { AuthService } from '../../../../auth/auth.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { AnonymousUser } from '../../../../shared/models/user/anonymous-user.model';
import { IConversationMenuItem } from '../conversation-menu/conversation-menu-item.interface';
import {
  communitiesDesktopMenuItems,
  consultantDesktopMenuItems,
  ConversationManageItems,
  ConversationManageMenuItem,
  userDesktopMenuItems,
} from './manage-panel-menu';
import { ConversationHeaderService } from '../../../../shared/modules/header/providers/conversation-header.service';
import { ConversationMenuItemComponent } from '../conversation-menu-item/conversation-menu-item.component';
import { ConversationMobileMenuViewService } from '../../providers/conversation-mobile-menu-view.service';
import { OutletService } from '../../../../services/outlet.service';
import { ButtonComponent } from '../../../../shared/UIkit/button/button.component';
import { NgClass, NgComponentOutlet } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { IconMoreVerticalComponent } from '../../../../shared/icons/icon-more-vertical/icon-more-vertical.component';
import { DropdownListComponent } from '../../../../shared/complex-ui-components/dropdown-list/dropdown-list.component';
import { MobileMenuComponent } from '../mobile-menu/mobile-menu.component';
import { IconArrowComponent } from '../../../../shared/icons/icon-arrow/icon-arrow.component';
import { MockWrapComponent } from '../mock-wrap/mock-wrap.component';
import { ConversationDetailComponent } from '../../conversation-detail/conversation-detail.component';
import { IconPeopleComponent } from '../../../../shared/icons/icon-people/icon-people.component';
import { IconPullRequestComponent } from '../../../../shared/icons/icon-pull-request/icon-pull-request.component';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { LupaiChatBotComponent } from '../lupai-chat-bot/lupai-chat-bot.component';

@Component({
  selector: 'app-conversation-manage-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './conversation-manage-panel.component.html',
  standalone: true,
  providers: [ChatStateService],
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./conversation-manage-panel.component.scss'],
  imports: [
    ButtonComponent,
    NgClass,
    TranslateModule,
    IconMoreVerticalComponent,
    DropdownListComponent,
    MobileMenuComponent,
    ConversationMenuItemComponent,
    IconArrowComponent,
    MockWrapComponent,
    ConversationDetailComponent,
    LupaiChatBotComponent,
    NgComponentOutlet,
    IconPeopleComponent,
    IconPullRequestComponent,
    MatIcon,
    MatIconButton,
    MatMenu,
    MatMenuTrigger,
    MatMenuItem,
  ],
})
export class ConversationManagePanelComponent
  extends BaseComponent
  implements OnInit
{
  // Partner - это тот, кто не текущий пользователь
  readonly activeConversationPartners = input<IConversationUserInfo[]>([]);
  // Rater - это тот, кому платят деньги (адвизор)
  readonly activeConversationRater = input<IConversationUserInfo>();
  public conversation = input<Conversation>();
  public currentUser = input<User>(null);
  public internalConversationId = input<number>();
  public itemMainMenu = signal<ConversationManageMenuItem[]>([]);
  public dropDownMenu = signal<ConversationManageMenuItem | null>(null);
  public selected = signal<ConversationManageItems>('tasks');
  public selectedItem = signal<ConversationManageMenuItem>(null);
  readonly isOpenedMenu = signal(false);

  public internalChatConversation = signal<Conversation>(null);
  public currentPermissions = signal<Permissions>(null);
  public onlyIconMenu = signal<boolean>(null);
  public isRecordAudio = signal<boolean>(false);
  private readonly _isCounselor = toSignal(
    this._permissionsService.isCounselor$,
  );
  public isNotAuthorized = toSignal(
    this._authService.authorizedUser$.pipe(
      map(
        (authorizedUser) =>
          !authorizedUser || (authorizedUser as AnonymousUser).isAnonymous,
      ),
    ),
  );

  public isOpenMobileMenu = signal(false);

  private readonly _isNotAuthorizedOrAnonymousUser = toSignal(
    this._authService.notAuthorizedOrAnonymousUser$,
  );
  private readonly _isNotDesktop = toSignal(
    this.resizeService.isDesktop$.pipe(map((_) => !_)),
  );
  public menuItems = signal<ConversationManageMenuItem[]>([]);

  constructor(
    private conversationService: ConversationsService,
    private chatStateService: ChatStateService,
    private permissionService: PermissionService,
    private resizeService: ResizeService,
    private readonly _authService: AuthService,
    private readonly _permissionsService: PermissionService,
    private conversationHeaderService: ConversationHeaderService,
    private conversationMobileMenuViewService: ConversationMobileMenuViewService,
    private _outletService: OutletService,
  ) {
    super();
    this.onlyIconMenu.set(
      this.conversationMobileMenuViewService.getValueFromLocalStorage(),
    );
  }

  private _initPanelSelectedState() {
    if (
      this._isNotDesktop() &&
      this._isNotAuthorizedOrAnonymousUser() &&
      this.conversation().conversation_type !== 'community_chat'
    ) {
      this.selectConversationMenu('client_chat');
    }
    if (this.conversation().conversation_type === 'community_chat') {
      this.selectConversationMenu('subgroups');
    }
  }

  public closeMenu() {
    if (this.isOpenedMenu()) {
      this.isOpenedMenu.set(false);
    }
  }

  selectMenuItem(item: IConversationMenuItem) {
    this.closeMenu();
    this.selectConversationMenu(item.id as ConversationManageItems);
    this.isOpenMobileMenu.set(false);
  }

  ngOnInit(): void {
    this._initPanelSelectedState();
    this.permissionService.permissions$
      .pipe(takeUntil(this.destroyed))
      .subscribe((permissions) => {
        this.currentPermissions.set(permissions);
        if (permissions.isCounselor() && this.internalConversationId()) {
          this.getInternalChat();
        }
        this.setupMenu();
        this.selectActiveTab();
      });
  }

  private getInternalChat(): void {
    let conversation: Conversation;
    this.conversationService
      .fetchConversation(this.internalConversationId())
      .pipe(
        switchMap((conversationResponse) => {
          conversation = conversationResponse;
          return this.conversationService.getChatMessages(
            this.internalConversationId(),
            this.chatStateService.paginationStateSnapshot.itemsPerPage,
          );
        }),
        map((messages) => ({ ...conversation, messages })),
      )
      .subscribe((res: Conversation) => {
        this.internalChatConversation.set(createConversation(res));
      });
  }

  private selectActiveTab(): void {
    if (this.conversation().conversation_type === 'community_chat') {
      this.selectConversationMenu('subgroups');
    } else {
      if (
        this.currentPermissions().isCounselor() &&
        this.internalConversationId()
      ) {
        this.selectConversationMenu('internal_chat');
      }

      if (
        this.currentPermissions().isCounselor() &&
        !this.internalConversationId()
      ) {
        this.selectConversationMenu('robots');
      }

      if (!this.currentPermissions().isCounselor()) {
        this.selectConversationMenu('tasks');
      }
    }
  }

  public toggleMenu() {
    const currentState = this.isOpenedMenu();
    this.isOpenedMenu.set(!currentState);
  }

  private setupMenu() {
    let items: ConversationManageMenuItem[];
    if (this.conversation().conversation_type === 'community_chat') {
      items = [...communitiesDesktopMenuItems];
    } else {
      if (this._isCounselor()) {
        items = [...consultantDesktopMenuItems];
        if (!this.internalConversationId()) {
          const index = items.findIndex((item) => item.id === 'internal_chat');
          items.splice(index, 1);
        }
      } else {
        items = [...userDesktopMenuItems];
      }
    }
    const desktopMenu = items.splice(4);
    this.menuItems.set(desktopMenu);
    this.itemMainMenu.set(items);
  }

  public toggleMobileMenu() {
    const currentState = this.isOpenMobileMenu();
    this.isOpenMobileMenu.set(!currentState);
  }

  public selectConversationMenu(item: ConversationManageItems) {
    this.selected.set(item);
    let menu = this.itemMainMenu();
    const menuItem = this.itemMainMenu().find(
      (menuItem) => menuItem.id === item,
    );
    if (menuItem) {
      const inputs = { item: menuItem };
      this.conversationHeaderService.setUpComponent({
        component: ConversationMenuItemComponent,
        inputs: {
          item: {
            ...menuItem,
            inputs: { ...menuItem.inputs, color: '#1E1E1E', fill: '#1E1E1E' },
          },
        },
        isComponent: true,
      });
      menu = menu.map((el) => {
        return { ...el, selected: el.id === item };
      });
      this.itemMainMenu.set(menu);
      const updatedItem = {
        ...menuItem,
        selected: true,
        inputs: { ...inputs.item.inputs, color: '#F5F5F5', fill: '#F5F5F5' },
      };
      this.selectedItem.set(updatedItem);
    }
  }

  public navigateBackClickHandler(): void {
    this._outletService.navigateBack();
  }

  public handleAudioRecord(isRecordAudio: boolean) {
    this.isRecordAudio.set(isRecordAudio);
    this.isOpenMobileMenu.set(false);
  }
}
