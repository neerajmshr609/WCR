import { computed } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { inject } from '@angular/core';

import { UserContext } from '../../services/multi-agent-websocket.service';
import { AuthService } from '../../auth/auth.service';
import {
  LupaiRetrieverItem,
  LupaiOrganization,
  LupaiLanguageInfo,
  LupaiDomainInfo,
  LupaiSensitiveTopic,
  LupaiProcessingStage,
  STAGE_DISPLAY_MESSAGES,
} from './lupai-response.types';
import {
  adaptRetrieverItems,
  adaptOrganizations,
  adaptLanguageInfo,
  adaptDomainInfo,
} from './lupai-response.adapters';

export interface ConversationMessage {
  id: string;
  content: string;
  sender: 'user' | 'lupai';
  timestamp: number;
  model?: string;
  // User context for user messages
  userContext?: UserContext;
  userLocation?: string;
  // Kullanıcı resmi için ek alan
  user?: {
    image?: string;
    [key: string]: unknown;
  };
  // Enhanced Lupai response fields
  retrieverItems?: LupaiRetrieverItem[];
  organizations?: LupaiOrganization[];
  topics?: string[];
  intent?: string;
  isFinaResponse?: boolean;
  isClarification?: boolean;
  language?: LupaiLanguageInfo;
  domain?: LupaiDomainInfo;
  sensitiveTopic?: LupaiSensitiveTopic;
  improvedQuery?: string;
  answerFound?: boolean;
  // Processing status fields
  currentStage?: LupaiProcessingStage;
  stageProgress?: number; // 0-100 percentage
  statusMessage?: string;
  isProcessing?: boolean;
  error?: string;
}

export interface LupaiChatState {
  // Messages
  messages: ConversationMessage[];

  // UI State
  showScrollBottomButton: boolean;
  showRightMenu: boolean;

  // User Context
  userContext: UserContext;
  userLocation: string;

  // WebSocket Connection
  connectionState: 'disconnected' | 'connecting' | 'connected' | 'error';
  connectionErrors: string[];

  // Error Handling
  lastError: string | null;
}

const initialState: LupaiChatState = {
  messages: [],
  showScrollBottomButton: false,
  showRightMenu: false,
  userContext: {
    origin_country: '',
    time_in_germany: '',
    age: '',
  },
  userLocation: '',
  connectionState: 'disconnected',
  connectionErrors: [],
  lastError: null,
};

export const LupaiChatStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    // Computed selectors
    totalMessages: computed(() => store.messages().length),
    hasMessages: computed(() => store.messages().length > 0),
    lastMessage: computed(() => {
      const messages = store.messages();
      return messages.length > 0 ? messages[messages.length - 1] : null;
    }),
    isConnected: computed(() => {
      const connectionState = store.connectionState();
      return connectionState === 'connected';
    }),
    hasConnectionErrors: computed(() => store.connectionErrors().length > 0),
    canSendMessage: computed(() => {
      const isConnected = store.connectionState() === 'connected';
      return isConnected;
    }),
  })),
  withMethods((store) => {
    const authService = inject(AuthService);
    return {
      // Message Management
      addMessage: (message: ConversationMessage) => {
        patchState(store, {
          messages: [...store.messages(), message],
        });
      },

      addUserMessage: (content: string) => {
        const currentUser = authService.userSubject$.value;
        const userMessage: ConversationMessage = {
          id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          content: content.trim(),
          sender: 'user',
          timestamp: Date.now(),
          userContext:
            store.userContext() &&
            (store.userContext().origin_country ||
              store.userContext().time_in_germany ||
              store.userContext().age)
              ? store.userContext()
              : undefined,
          userLocation:
            store.userLocation() && store.userLocation().trim()
              ? store.userLocation()
              : undefined,
          user: currentUser ? { image: currentUser.image } : undefined,
        };

        patchState(store, {
          messages: [...store.messages(), userMessage],
        });
      },

      clearMessages: () => {
        patchState(store, { messages: [] });
      },

      // UI State Management
      setShowScrollBottomButton: (show: boolean) => {
        patchState(store, { showScrollBottomButton: show });
      },

      toggleRightMenu: () => {
        patchState(store, { showRightMenu: !store.showRightMenu() });
      },

      closeRightMenu: () => {
        patchState(store, { showRightMenu: false });
      },

      // User Context Management
      updateUserContext: (context: Partial<UserContext>) => {
        patchState(store, {
          userContext: { ...store.userContext(), ...context },
        });
      },

      setUserLocation: (location: string) => {
        patchState(store, { userLocation: location });
      },

      initializeUserContext: () => {
        // Initialize with empty context so form will show on first focus
        const emptyContext: UserContext = {
          origin_country: '',
          time_in_germany: '',
          age: '',
        };

        patchState(store, {
          userContext: emptyContext,
          userLocation: '',
        });
      },

      // WebSocket Connection Management
      setConnectionState: (
        state: 'disconnected' | 'connecting' | 'connected' | 'error',
      ) => {
        patchState(store, { connectionState: state });
      },

      addConnectionError: (error: string) => {
        patchState(store, {
          connectionErrors: [...store.connectionErrors(), error],
        });
      },

      clearConnectionErrors: () => {
        patchState(store, { connectionErrors: [] });
      },

      // Error Handling
      setError: (error: string | null) => {
        patchState(store, { lastError: error });
      },

      clearError: () => {
        patchState(store, { lastError: null });
      },

      // WebSocket Response Handler with enhanced Lupai support and duplication prevention
      handleWebSocketResponse: (response: Record<string, any> | null) => {
        // Skip processing if response is empty or invalid
        if (!response || typeof response !== 'object') {
          return;
        }

        // Handle processing stages (status updates)
        if (response.status && !response.assistant_response) {
          const messages = store.messages();
          const lastMessage = messages[messages.length - 1];

          // Update or create processing message
          if (lastMessage && lastMessage.isProcessing) {
            // Update existing processing message
            const updatedMessage: ConversationMessage = {
              ...lastMessage,
              statusMessage:
                response.status_display?.display_message ||
                STAGE_DISPLAY_MESSAGES[
                  response.status as LupaiProcessingStage
                ] ||
                'Processing...',
              currentStage: response.status as LupaiProcessingStage,
              stageProgress: (() => {
                const stages = Object.values(LupaiProcessingStage);
                const stageIndex = stages.indexOf(
                  response.status as LupaiProcessingStage,
                );
                if (stageIndex === -1) return 0;
                return Math.round((stageIndex / (stages.length - 1)) * 100);
              })(),
            };

            const updatedMessages = [...messages.slice(0, -1), updatedMessage];
            patchState(store, {
              messages: updatedMessages,
            });
          } else {
            // Create new processing message
            const processingMessage: ConversationMessage = {
              id: `processing_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              content: '',
              sender: 'lupai',
              timestamp: Date.now(),
              isProcessing: true,
              statusMessage:
                response.status_display?.display_message ||
                STAGE_DISPLAY_MESSAGES[
                  response.status as LupaiProcessingStage
                ] ||
                'Processing...',
              currentStage: response.status as LupaiProcessingStage,
              stageProgress: (() => {
                const stages = Object.values(LupaiProcessingStage);
                const stageIndex = stages.indexOf(
                  response.status as LupaiProcessingStage,
                );
                if (stageIndex === -1) return 0;
                return Math.round((stageIndex / (stages.length - 1)) * 100);
              })(),
            };

            patchState(store, {
              messages: [...messages, processingMessage],
            });
          }
          return;
        }

        // Handle errors
        if (response.error) {
          console.error('❌ WebSocket error:', response.error);

          const errorMessage: ConversationMessage = {
            id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            content: `I apologize, but I encountered an error: ${response.error.detail}. Please try again.`,
            sender: 'lupai',
            timestamp: Date.now(),
            error: response.error.detail,
          };

          // Remove any processing messages and add error
          const cleanedMessages = store
            .messages()
            .filter((msg) => !msg.isProcessing);

          patchState(store, {
            messages: [...cleanedMessages, errorMessage],
            lastError: response.error.detail,
          });
          return;
        }

        // Handle final responses with assistant content
        const hasValidResponse =
          response.assistant_response &&
          (response.assistant_response.answer ||
            response.assistant_response.improved_answer);

        if (!hasValidResponse) {
          return;
        }

        // Remove any processing messages
        const cleanedMessages = store
          .messages()
          .filter((msg) => !msg.isProcessing);

        // Check for duplicate responses by content
        const content =
          response.assistant_response.improved_answer ||
          response.assistant_response.answer;
        const isDuplicate = cleanedMessages.some(
          (msg) =>
            msg.sender === 'lupai' &&
            msg.content === content &&
            Math.abs(Date.now() - msg.timestamp) < 5000, // Within 5 seconds
        );

        if (isDuplicate) {
          return;
        }

        // Create final conversation message
        const lupaiMessage: ConversationMessage = {
          id: `final_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          content,
          sender: 'lupai',
          timestamp: Date.now(),
          retrieverItems: response.retriever_items
            ? adaptRetrieverItems(response.retriever_items)
            : undefined,
          organizations: response.organizations
            ? adaptOrganizations(response.organizations)
            : undefined,
          topics: response.topics,
          intent: response.intent,
          isFinaResponse: response.is_final_response,
          isClarification: response.is_clarification,
          language: response.language
            ? adaptLanguageInfo(response.language)
            : undefined,
          domain: response.domain
            ? adaptDomainInfo(response.domain)
            : undefined,
          sensitiveTopic: response.sensitive_topic
            ? {
                topic: response.sensitive_topic.topic,
                warning: response.sensitive_topic.warning,
              }
            : undefined,
          improvedQuery: response.improved_query?.query,
          answerFound: response.assistant_response.answer_found,
        };

        patchState(store, {
          messages: [...cleanedMessages, lupaiMessage],
          lastError: null,
        });
      },

      // Welcome Message
      addWelcomeMessage: () => {
        const welcomeMessage: ConversationMessage = {
          id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          content: 'lupai_chatbot.welcome_message',
          sender: 'lupai',
          timestamp: Date.now(),
          //model: 'welcome-v1',
        };

        const currentMessages = store.messages();
        patchState(store, {
          messages: [...currentMessages, welcomeMessage],
        });
      },

      // User Context Saved Message
      addUserContextSavedMessage: (
        context: UserContext,
        userLocation?: string,
      ) => {
        const infoMessage: ConversationMessage = {
          id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          content: 'lupai_chatbot.user_context_saved',
          sender: 'lupai',
          timestamp: Date.now(),
          userContext: context,
          userLocation: userLocation,
        };
        const currentMessages = store.messages();
        patchState(store, {
          messages: [...currentMessages, infoMessage],
        });
      },
    };
  }),
);
