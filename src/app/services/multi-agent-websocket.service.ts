import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject, throwError, of, timer, interval } from 'rxjs';
import { switchMap, take, catchError, filter, takeUntil } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../environments/environment';

export interface UserContext {
  origin_country: string;
  time_in_germany: string;
  age: string;
}

export interface WebSocketInput {
  user_query: string;
  user_context: UserContext;
  location: string;
}

export interface WebSocketOutput {
  assistant_response?: {
    answer: string;
    improved_answer?: string;
    answer_found: boolean;
  };
  retriever_items?: RetrieverItem[];
  status?: string;
  status_display?: {
    status: string;
    display_message: string;
  };
  language?: LanguageInfo;
  domain?: DomainInfo;
  improved_query?: {
    query: string;
    warning?: string;
  };
  sensitive_topic?: {
    topic: string;
    warning: string;
  };
  intent?: string;
  topics?: string[];
  organizations?: Organization[];
  is_final_response: boolean;
  is_clarification: boolean;
  error?: {
    detail: string;
  };
}

export interface RetrieverItem {
  chunk_id: number;
  keyword_score: number;
  vector_score: number;
  relative_hybrid_score: number;
  collection_metadata: Record<string, unknown>;
  child_node_ids?: number[];
}

export interface Organization {
  name: string;
  description: string;
  website: string;
  score: number;
}

export interface LanguageInfo {
  language_code: string;
  language_name: string;
}

export interface DomainInfo {
  domain: string | null;
  is_valid: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class MultiAgentWebsocketService implements OnDestroy {
  private websocket: WebSocket | null = null;
  private destroy$ = new Subject<void>();
  private heartbeatInterval = 30000; // 30 seconds
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  // Simple observables for Effects to subscribe to
  public messages$ = new Subject<WebSocketOutput>();
  public connectionState$ = new Subject<
    'connecting' | 'connected' | 'disconnected' | 'error'
  >();
  public errors$ = new Subject<string>();

  constructor(private authService: AuthService) {
    this.startHeartbeat();
  }

  connect(): Observable<void> {
    return this.authService.storageState$.pipe(
      take(1), // Take only first emission
      switchMap((authState) => {
        if (!authState?.accessToken) {
          const error = 'Authentication required for WebSocket connection';
          this.errors$.next(error);
          return throwError(() => new Error(error));
        }

        // Prevent duplicate connections
        if (this.websocket?.readyState === WebSocket.OPEN) {
          console.log(
            '⚠️ WebSocket already connected, skipping duplicate connection',
          );
          return of(undefined);
        }

        // Close any existing connection in bad state
        if (this.websocket && this.websocket.readyState !== WebSocket.CLOSED) {
          console.log(
            '🔄 Closing existing WebSocket in bad state before reconnecting',
          );
          this.websocket.close();
          this.websocket = null;
        }

        this.connectionState$.next('connecting');

        return new Observable<void>((observer) => {
          try {
            // Use environment variables for lupai configuration
            const token = environment.lupai.token;
            const wsUrl = `${environment.lupai.wsUrl}?token=${token}`;

            this.websocket = new WebSocket(wsUrl);
            this.setupEventListeners(
              () => {
                observer.next();
                observer.complete();
              },
              (error) => {
                observer.error(error);
              },
            );
          } catch (error) {
            const errorMessage = `Failed to create WebSocket connection: ${error}`;
            this.errors$.next(errorMessage);
            this.connectionState$.next('error');
            observer.error(error);
          }
        });
      }),
      catchError((error) => {
        console.error('❌ Connection failed:', error);
        return throwError(() => error);
      }),
    );
  }

  private setupEventListeners(
    onSuccess: () => void,
    onError: (error: Error) => void,
  ): void {
    if (!this.websocket) return;

    this.websocket.onopen = (): void => {
      console.log('✅ WebSocket connected');
      this.connectionState$.next('connected');
      onSuccess();
    };

    this.websocket.onmessage = (event): void => {
      try {
        const data = JSON.parse(event.data) as WebSocketOutput;
        this.messages$.next(data);
      } catch (error) {
        console.error('❌ Error parsing WebSocket response:', error);
        this.errors$.next('Failed to parse server response');
      }
    };

    this.websocket.onerror = (error): void => {
      console.error('❌ WebSocket error:', error);
      const errorMessage = `WebSocket connection error: ${error}`;
      this.errors$.next(errorMessage);
      this.connectionState$.next('error');
      onError(new Error(errorMessage));
    };

    this.websocket.onclose = (event): void => {
      console.log('🔌 WebSocket connection closed:', event.code, event.reason);
      this.connectionState$.next('disconnected');
    };
  }

  sendMessage(input: WebSocketInput): Observable<void> {
    return new Observable<void>((observer) => {
      if (!this.websocket || this.websocket.readyState !== WebSocket.OPEN) {
        const error = 'WebSocket not connected';
        this.errors$.next(error);
        observer.error(new Error(error));
        return;
      }

      try {
        const messageString = JSON.stringify(input);
        this.websocket.send(messageString);
        console.log(
          '📤 Message sent:',
          input.user_query.substring(0, 50) + '...',
        );
        observer.next();
        observer.complete();
      } catch (error) {
        const errorMessage = `Failed to send message: ${error}`;
        this.errors$.next(errorMessage);
        observer.error(new Error(errorMessage));
      }
    });
  }

  disconnect(): void {
    if (this.websocket) {
      this.websocket.close(1000, 'Manual disconnect');
      this.websocket = null;
    }
    this.connectionState$.next('disconnected');
  }

  private startHeartbeat(): void {
    interval(this.heartbeatInterval)
      .pipe(
        takeUntil(this.destroy$),
        filter(() => this.websocket?.readyState === WebSocket.OPEN),
      )
      .subscribe(() => {
        this.sendHeartbeat();
      });
  }

  private sendHeartbeat(): void {
    if (this.websocket?.readyState === WebSocket.OPEN) {
      try {
        this.websocket.send(JSON.stringify({ ping: true }));
      } catch (error) {
        console.warn('⚠️ Heartbeat failed:', error);
        this.handleConnectionLoss();
      }
    }
  }

  private handleConnectionLoss(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);

      console.log(
        `🔄 Attempting reconnection ${this.reconnectAttempts}/${this.maxReconnectAttempts} in ${delay}ms`,
      );

      timer(delay).subscribe(() => {
        this.connect().subscribe({
          next: () => {
            this.reconnectAttempts = 0;
            console.log('✅ Reconnection successful');
          },
          error: (error) => {
            console.error('❌ Reconnection failed:', error);
            this.handleConnectionLoss();
          },
        });
      });
    } else {
      console.error('❌ Max reconnection attempts reached');
      this.connectionState$.next('error');
      this.errors$.next('Connection lost and could not be restored');
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.disconnect();
  }
}
