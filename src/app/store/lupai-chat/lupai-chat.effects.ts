import { Injectable, inject } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { createAction, props } from '@ngrx/store';
import { timer, EMPTY, merge } from 'rxjs';
import {
  tap,
  switchMap,
  filter,
  catchError,
  delay,
  retryWhen,
  scan,
  mergeMap,
  map,
} from 'rxjs/operators';

import { LupaiChatStore } from './lupai-chat.store';
import {
  MultiAgentWebsocketService,
  WebSocketOutput,
  WebSocketInput,
  UserContext,
} from '../../services/multi-agent-websocket.service';

// Simplified LupaiChat actions - removed unused actions
export const LupaiChatActions = {
  // Lifecycle actions
  startLupaiChat: createAction('[LupaiChat] Start Chat'),
  stopLupaiChat: createAction('[LupaiChat] Stop Chat'),
  resetLupaiChat: createAction('[LupaiChat] Reset Chat'),

  // Page navigation actions
  userEnteredChatPage: createAction('[LupaiChat] User Entered Chat Page'),
  userLeftChatPage: createAction('[LupaiChat] User Left Chat Page'),

  // Connection actions
  initializeConnection: createAction('[LupaiChat] Initialize Connection'),

  // Message actions
  sendMessage: createAction(
    '[LupaiChat] Send Message',
    props<{ content: string }>(),
  ),

  // Direct store update actions (can be called directly on store)
  updateUserContext: createAction(
    '[LupaiChat] Update User Context',
    props<{ context: Partial<UserContext> }>(),
  ),
  resetUserContext: createAction('[LupaiChat] Reset User Context'),
  clearMessages: createAction('[LupaiChat] Clear Messages'),
  addWelcomeMessage: createAction('[LupaiChat] Add Welcome Message'),
  addUserContextSavedMessage: createAction(
    '[LupaiChat] Add User Context Saved Message',
    props<{ context: UserContext; userLocation?: string }>(),
  ),
};

@Injectable({ providedIn: 'root' })
export class LupaiChatEffects {
  private actions$ = inject(Actions);
  private multiAgentService = inject(MultiAgentWebsocketService);
  private lupaiChatStore = inject(LupaiChatStore);

  // Connection configuration
  private readonly maxReconnectAttempts = 5;
  private readonly reconnectDelay = 1000;

  // Track if user is on chat page to prevent unwanted reconnections
  private isUserOnChatPage = false;

  // Initialize WebSocket Connection with retry logic
  initializeConnection$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(LupaiChatActions.initializeConnection),
        tap(() => {
          this.lupaiChatStore.setConnectionState('connecting');
          this.lupaiChatStore.clearConnectionErrors();
        }),
        switchMap(() => {
          return this.multiAgentService.connect().pipe(
            tap(() => {
              this.lupaiChatStore.setConnectionState('connected');
              this.lupaiChatStore.clearConnectionErrors();
            }),
            retryWhen((errors) =>
              errors.pipe(
                scan((retryCount, error) => {
                  if (retryCount >= this.maxReconnectAttempts) {
                    console.error('❌ Max reconnection attempts reached');
                    this.lupaiChatStore.setConnectionState('error');
                    this.lupaiChatStore.addConnectionError(
                      'Max reconnection attempts reached',
                    );
                    throw error;
                  }

                  const attempt = retryCount + 1;
                  this.lupaiChatStore.addConnectionError(
                    `Reconnection attempt ${attempt}/${this.maxReconnectAttempts}`,
                  );

                  return attempt;
                }, 0),
                delay(this.reconnectDelay),
              ),
            ),
            catchError((error) => {
              console.error(
                '❌ WebSocket connection failed permanently:',
                error,
              );
              this.lupaiChatStore.setConnectionState('error');
              this.lupaiChatStore.addConnectionError(
                error.message || 'Connection failed permanently',
              );
              return EMPTY;
            }),
          );
        }),
      );
    },
    { dispatch: false },
  );

  // Monitor connection state changes and auto-reconnect
  monitorConnectionState$ = createEffect(() => {
    return this.multiAgentService.connectionState$.pipe(
      tap((state) => {
        this.lupaiChatStore.setConnectionState(state);
        if (state === 'connected') {
          this.lupaiChatStore.clearConnectionErrors();
        }
      }),
      switchMap((state) => {
        // Only attempt reconnection if user is still on chat page
        if (state === 'disconnected' && this.isUserOnChatPage) {
          this.lupaiChatStore.setConnectionState('connecting');
          return timer(this.reconnectDelay).pipe(
            map(() => LupaiChatActions.initializeConnection()),
          );
        }
        return EMPTY;
      }),
    );
  });

  // Handle incoming WebSocket messages
  handleIncomingMessages$ = createEffect(
    () => {
      return this.multiAgentService.messages$.pipe(
        filter((message): message is WebSocketOutput => message !== null),
        tap((message) => {
          this.lupaiChatStore.handleWebSocketResponse(message);
        }),
        catchError((error) => {
          console.error('❌ Error processing WebSocket message:', error);
          this.handleError(
            error,
            'I apologize, but I encountered an error processing your request. Please try again.',
          );
          return EMPTY;
        }),
      );
    },
    { dispatch: false },
  );

  // Monitor connection errors from service
  monitorConnectionErrors$ = createEffect(
    () => {
      return this.multiAgentService.errors$.pipe(
        tap((error) => {
          if (error) {
            console.error('💥 WebSocket error received:', error);
            this.lupaiChatStore.addConnectionError(error);
            this.lupaiChatStore.setConnectionState('error');
          }
        }),
      );
    },
    { dispatch: false },
  );

  // Send message through WebSocket
  sendMessage$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(LupaiChatActions.sendMessage),
        mergeMap(({ content }) => {
          // Add user message to store immediately
          this.lupaiChatStore.addUserMessage(content);
          this.lupaiChatStore.clearError();

          // Prepare WebSocket input
          const input: WebSocketInput = {
            user_query: content,
            user_context: this.lupaiChatStore.userContext(),
            location: this.lupaiChatStore.userLocation(),
          };

          return this.multiAgentService.sendMessage(input).pipe(
            catchError((error) => {
              console.error('❌ Failed to send message:', error);
              this.handleError(
                error,
                "Sorry, I couldn't send your message. Please check your connection and try again.",
              );
              return EMPTY;
            }),
          );
        }),
      );
    },
    { dispatch: false },
  );

  // Auto-initialize connection when chat starts
  autoInitializeOnStart$ = createEffect(() => {
    return merge(
      this.actions$.pipe(ofType(LupaiChatActions.startLupaiChat)),
      this.actions$.pipe(ofType(LupaiChatActions.userEnteredChatPage)),
    ).pipe(
      tap(() => {
        this.isUserOnChatPage = true; // User entered chat page
        this.lupaiChatStore.initializeUserContext();
      }),
      map(() => LupaiChatActions.initializeConnection()),
    );
  });

  // Cleanup on chat stop
  cleanupOnStop$ = createEffect(
    () => {
      return merge(
        this.actions$.pipe(ofType(LupaiChatActions.stopLupaiChat)),
        this.actions$.pipe(ofType(LupaiChatActions.userLeftChatPage)),
        this.actions$.pipe(ofType(LupaiChatActions.resetLupaiChat)),
      ).pipe(
        tap(() => {
          this.isUserOnChatPage = false; // User left chat page
          this.multiAgentService.disconnect();
          this.lupaiChatStore.setConnectionState('disconnected');
        }),
      );
    },
    { dispatch: false },
  );

  // Update user context - kept as effect for consistency with other NgRx patterns
  updateUserContext$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(LupaiChatActions.updateUserContext),
        tap(({ context }) => {
          this.lupaiChatStore.updateUserContext(context);
        }),
      );
    },
    { dispatch: false },
  );

  // Clear messages
  clearMessages$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(LupaiChatActions.clearMessages),
        tap(() => {
          this.lupaiChatStore.clearMessages();
        }),
      );
    },
    { dispatch: false },
  );

  // Add welcome message
  addWelcomeMessage$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(LupaiChatActions.addWelcomeMessage),
        tap(() => {
          this.lupaiChatStore.addWelcomeMessage();
        }),
      );
    },
    { dispatch: false },
  );

  // Add user context saved message
  addUserContextSavedMessage$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(LupaiChatActions.addUserContextSavedMessage),
        tap(({ context, userLocation }) => {
          this.lupaiChatStore.addUserContextSavedMessage(context, userLocation);
        }),
      );
    },
    { dispatch: false },
  );

  // Reset user context
  resetUserContext$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(LupaiChatActions.resetUserContext),
        tap(() => {
          this.lupaiChatStore.initializeUserContext();
        }),
      );
    },
    { dispatch: false },
  );

  /**
   * Unified error handling method
   * @param error - The error that occurred
   * @param userMessage - User-friendly error message
   */
  private handleError(error: unknown, userMessage: string): void {
    const errorMessage = {
      id: this.generateMessageId(),
      content: userMessage,
      sender: 'lupai' as const,
      timestamp: Date.now(),
    };

    this.lupaiChatStore.addMessage(errorMessage);
    this.lupaiChatStore.setError(
      error instanceof Error ? error.message : 'An unexpected error occurred',
    );
  }

  /**
   * Generate unique message ID
   */
  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
