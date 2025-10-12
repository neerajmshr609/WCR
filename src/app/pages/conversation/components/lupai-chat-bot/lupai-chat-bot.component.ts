import {
  Component,
  ChangeDetectionStrategy,
  viewChild,
  ElementRef,
  inject,
  OnInit,
  OnDestroy,
  EventEmitter,
  signal,
  computed,
  DestroyRef,
  TemplateRef,
} from '@angular/core';
import { NgClass } from '@angular/common';
import { Store } from '@ngrx/store';
import { timer, fromEvent } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { TranslateModule } from '@ngx-translate/core';

// Local imports
import { UserContext } from '../../../../services/multi-agent-websocket.service';
import { OutletService } from '../../../../services/outlet.service';
// Import SharedModule for components like TextInputComponent, MessageComponent, ScrollDownBtnComponent
import { SharedModule } from '../../../../shared/shared.module';
// Import TextInputComponent for ViewChild type reference
import { TextInputComponent } from '../../../../shared/components/text-input/text-input.component';
// Import specialized Lupai message component
import { LupaiMessageComponent } from './components/lupai-message/lupai-message.component';
import { UserContextFormComponent } from './components/user-context-form/user-context-form.component';
import { LupaiRightSidebarComponent } from './components/lupai-right-sidebar/lupai-right-sidebar.component';
// Import button and icon components
import { ButtonComponent } from '../../../../shared/UIkit/button/button.component';
import { IconArrowComponent } from '../../../../shared/icons/icon-arrow/icon-arrow.component';

// NgRx Signal Store imports
import { LupaiChatStore } from '../../../../store/lupai-chat/lupai-chat.store';
import { LupaiChatActions } from '../../../../store/lupai-chat/lupai-chat.effects';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LupaiHeaderComponent } from './components/lupai-header/lupai-header.component';
import { ScrollBtnModule } from '../../../../shared/components/scroll-btn/scroll-btn.module';
// Import ConversationHeaderService for header management
import { ConversationHeaderService } from '../../../../shared/modules/header/providers/conversation-header.service';
import { LupaiMobileHeaderComponent } from './components/lupai-mobile-header/lupai-mobile-header.component';

@Component({
  selector: 'app-lupai-chat-bot',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './lupai-chat-bot.component.html',
  styleUrls: ['./lupai-chat-bot.component.scss'],
  imports: [
    NgClass,
    SharedModule,
    LupaiMessageComponent,
    UserContextFormComponent,
    LupaiRightSidebarComponent,
    LupaiHeaderComponent,
    ScrollBtnModule,
    ButtonComponent,
    IconArrowComponent,
    LupaiMobileHeaderComponent,
    TranslateModule,
  ],
})
export class LupaiChatBotComponent implements OnInit, OnDestroy {
  // Modern signal-based ViewChild alternatives
  textInput = viewChild<TextInputComponent>('textInput');
  chatContainer = viewChild<ElementRef>('chatContainer');
  lupaiHeaderTemplate = viewChild<TemplateRef<unknown>>('lupaiHeaderTemplate');

  // Injected services
  private lupaiChatStore = inject(LupaiChatStore);
  private store = inject(Store);
  private destroyRef = inject(DestroyRef);
  private outletService = inject(OutletService);
  private conversationHeaderService = inject(ConversationHeaderService);
  private breakpointObserver = inject(BreakpointObserver);

  // State from NgRx Signal Store
  public messages = this.lupaiChatStore.messages;

  public showScrollBottomButton = this.lupaiChatStore.showScrollBottomButton;
  public showRightMenu = this.lupaiChatStore.showRightMenu;
  public userContext = this.lupaiChatStore.userContext;
  public userLocation = this.lupaiChatStore.userLocation;
  public connectionState = this.lupaiChatStore.connectionState;
  public connectionErrors = this.lupaiChatStore.connectionErrors;
  public lastError = this.lupaiChatStore.lastError;

  // Computed values from store
  public totalMessages = this.lupaiChatStore.totalMessages;
  public hasMessages = this.lupaiChatStore.hasMessages;
  public isConnected = this.lupaiChatStore.isConnected;
  public canSendMessage = this.lupaiChatStore.canSendMessage;

  // Local UI properties
  public sendBtnSrc = 'assets/icons/send.svg';
  public scaleSendBtn = false;

  // Events
  public messageSentEvt = new EventEmitter<void>();
  public focusInput = new EventEmitter<void>();

  // Form visibility state
  public showUserContextForm = signal<boolean>(false);

  // Enhanced user feedback - using computed signals instead
  public showConnectionStatus = computed(() => !this.isConnected());
  public connectionStatusMessage = computed(() => {
    const state = this.connectionState();
    const messages = {
      connecting: 'Connecting to Lupai...',
      disconnected: 'Connection lost. Attempting to reconnect...',
      error: 'Connection failed. Please check your internet connection.',
    };
    return (
      messages[state as keyof typeof messages] || 'Unknown connection status'
    );
  });

  // Responsive state
  public mobileHeaderVisible = signal<boolean>(false);

  // Input editability - disable on mobile when user context form is open
  public inputEditable = computed(() => {
    const isMobile = this.mobileHeaderVisible();
    const formVisible = this.showUserContextForm();

    // If on mobile and user context form is open, disable input to prevent keyboard
    if (isMobile && formVisible) {
      return false;
    }

    return this.canSendMessage();
  });

  constructor() {}

  ngOnInit(): void {
    // Setup mobile detection
    this.breakpointObserver
      .observe([Breakpoints.Large, Breakpoints.XLarge])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => {
        // isMobile is true when screen is smaller than Large (< 1280px)
        this.mobileHeaderVisible.set(!result.matches);
      });

    // Register lupai header template with the conversation header service
    // Use setTimeout to ensure template is available after view init
    const template = this.lupaiHeaderTemplate();
    if (template) {
      this.conversationHeaderService.setUpComponent({
        component: template,
        inputs: {},
        isComponent: false,
      });
    }

    if (this.messages().length > 0) {
      timer(100)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => this.scrollToLastMessage());
    }

    // Dispatch action to start LupaiChat effects (this will auto-initialize connection)
    this.store.dispatch(LupaiChatActions.userEnteredChatPage());

    // Add welcome message if no messages exist - moved here for better timing
    timer(100) // Small delay to ensure store is ready
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.addWelcomeMessageIfNeeded();
      });

    // Setup scroll event listener with delay to ensure element is ready
    timer(100)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        const element = this.chatContainer()?.nativeElement;
        if (element) {
          fromEvent(element, 'scroll')
            .pipe(
              takeUntilDestroyed(this.destroyRef),
              tap(() => this.checkScrollPosition()),
            )
            .subscribe();
        }
      });
  }

  ngOnDestroy(): void {
    // Clear the conversation header service when component is destroyed
    this.conversationHeaderService.clearComponent();

    this.store.dispatch(LupaiChatActions.userLeftChatPage());
  }

  private addWelcomeMessageIfNeeded(): void {
    const currentMessages = this.messages();

    if (currentMessages.length === 0) {
      this.store.dispatch(LupaiChatActions.addWelcomeMessage());
    }
  }

  onSendClick(messageData: Partial<{ body?: string; content?: string }>): void {
    try {
      // Extract the message content from the messageData object
      const content = messageData?.body || messageData?.content || '';

      if (!content || typeof content !== 'string' || !content.trim()) {
        this.lupaiChatStore.setError('Please enter a message before sending.');
        return;
      }

      // Check connection state before sending
      if (!this.isConnected()) {
        this.lupaiChatStore.setError(
          'Not connected to chat service. Please wait for connection to be restored.',
        );
        return;
      }

      // Clear any previous errors
      this.lupaiChatStore.clearError();

      // Dispatch send message action instead of calling store method directly
      this.store.dispatch(
        LupaiChatActions.sendMessage({ content: content.trim() }),
      );

      // Close user context form when message is sent
      this.showUserContextForm.set(false);

      // Emit message sent event
      this.messageSentEvt.emit();
      this.scrollToLastMessage();
    } catch (error) {
      console.error('❌ Error in onSendClick:', error);
      this.lupaiChatStore.setError('Failed to send message. Please try again.');
    }
  }

  updateUserContext(context: Partial<UserContext>): void {
    this.store.dispatch(LupaiChatActions.updateUserContext({ context }));
  }

  toggleRightMenu(): void {
    console.log('this feature is not implemented yet');
    //this.lupaiChatStore.toggleRightMenu();
  }

  closeRightMenu(): void {
    this.lupaiChatStore.closeRightMenu();
  }

  handlePlusAction(): void {
    // Start a new conversation by clearing existing messages
    this.store.dispatch(LupaiChatActions.clearMessages());
    // Reset user context via store/effect
    this.store.dispatch(LupaiChatActions.resetUserContext());
    // Reset user context form if needed
    this.showUserContextForm.set(false);

    // Add welcome message after clearing messages
    timer(100)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.addWelcomeMessageIfNeeded();
        // Focus on input for new conversation
        this.focusInput.emit();
      });
  }

  handleMenuAction(): void {
    this.closeRightMenu();
  }

  clearMessages(): void {
    this.store.dispatch(LupaiChatActions.clearMessages());
    // Add welcome message after clearing
    timer(100)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {});
  }

  scrollToLastMessage(): void {
    console.log('🔘 Scroll button clicked - scrollToLastMessage called');
    try {
      const element = this.chatContainer()?.nativeElement;
      if (!element) {
        console.log('❌ No element found');
        return;
      }

      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        try {
          console.log('🔄 Scrolling to last message');
          element.scrollTo({
            top: element.scrollHeight,
            behavior: 'smooth',
          });
        } catch (error) {
          console.error('❌ Error in scrollTo animation:', error);
          // Fallback to instant scroll
          element.scrollTop = element.scrollHeight;
        }
      });
    } catch (error) {
      console.error('❌ Error scrolling to last message:', error);
    }
  }

  onTopicClicked(topic: string): void {
    try {
      if (!topic || typeof topic !== 'string' || !topic.trim()) {
        return;
      }

      // Generate a question about the topic
      const topicQuestion = `Tell me more about "${topic.trim()}" in the context of German law and regulations.`;

      // Send the topic as a new message using action dispatch
      this.store.dispatch(
        LupaiChatActions.sendMessage({ content: topicQuestion }),
      );

      // Optional: Focus the input field after sending
      timer(100)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
          try {
            this.focusInput.emit();
          } catch (error) {
            console.error('❌ Error focusing input:', error);
          }
        });
    } catch (error) {
      console.error('❌ Error handling topic click:', error);
      this.lupaiChatStore.setError(
        'Failed to process topic selection. Please try again.',
      );
    }
  }

  /**
   * User context form methods
   */
  onInputFocus(): void {
    // Check if user context is empty or incomplete
    const context = this.userContext();

    const isEmpty =
      !context ||
      (!context.origin_country && !context.time_in_germany && !context.age);
    const isIncomplete =
      context &&
      (!context.origin_country || !context.time_in_germany || !context.age);

    if (isEmpty || isIncomplete) {
      this.showUserContextForm.set(true);
    }
  }

  onUserContextUpdated(
    userContext: UserContext & { current_area_of_residence?: string },
  ): void {
    // Update the user context using action dispatch
    this.store.dispatch(
      LupaiChatActions.updateUserContext({ context: userContext }),
    );
    // If location is present, update it as well
    if (userContext.current_area_of_residence) {
      this.lupaiChatStore.setUserLocation(
        userContext.current_area_of_residence,
      );
    }
    // Formu otomatik kapat
    this.showUserContextForm.set(false);
  }

  onUserContextFormSubmitted(data: {
    userContext: UserContext;
    question: string;
  }): void {
    // Önce context'i güncelle
    this.store.dispatch(
      LupaiChatActions.updateUserContext({ context: data.userContext }),
    );

    // Güncel context ve location ile mesaj ekle
    this.store.dispatch(
      LupaiChatActions.addUserContextSavedMessage({
        context: data.userContext,
        userLocation: this.userLocation(),
      }),
    );
    this.showUserContextForm.set(false);
  }

  onUserContextFormClosed(): void {
    this.showUserContextForm.set(false);
  }

  onUserLocationUpdated(location: string): void {
    this.lupaiChatStore.setUserLocation(location);
  }

  // Retry connection mechanism
  retryConnection(): void {
    this.store.dispatch(LupaiChatActions.initializeConnection());
  }

  private checkScrollPosition(): void {
    try {
      const element = this.chatContainer()?.nativeElement;
      if (!element) {
        return;
      }

      const scrollTop = element.scrollTop;
      const scrollHeight = element.scrollHeight;
      const clientHeight = element.clientHeight;
      const showScrollButton = scrollHeight - scrollTop - clientHeight >= 100;

      // Only update if values are valid
      if (scrollHeight > 0 && clientHeight > 0) {
        this.lupaiChatStore.setShowScrollBottomButton(showScrollButton);
      }
    } catch (error) {
      console.error('❌ Error checking scroll position:', error);
    }
  }

  navigateBackClickHandler(): void {
    this.outletService.navigateBack();
  }
}
