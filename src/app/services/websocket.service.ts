import { Injectable } from '@angular/core';
import { ActionCableService, Channel } from 'angular2-actioncable';
import { BehaviorSubject } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { MessagesService } from './messages.service';
import { MessageNotificationComponent } from '../shared/components/message-notification/message-notification.component';
import { ToastrService } from 'ngx-toastr';
import { createWsMessage, MessageWs } from '../shared/models/message-ws';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { Message, MessageSpecial } from '../shared/models/message.model';
import { createHttpParams } from '../shared/functions/http-params';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  messageChannel: Channel;
  newMessage$ = new BehaviorSubject(null);

  meetCounterChannel: Channel;
  meetCounter$ = new BehaviorSubject(null);

  sessionChannel: Channel;
  newSession$ = new BehaviorSubject(null);

  public newPaidFeedbackRequest$ = new BehaviorSubject(false);
  public currentConversationId$ = new BehaviorSubject(null);
  public specialMessage$ = new BehaviorSubject<{
    messageType: MessageSpecial;
    message: Message | MessageWs;
  }>(null);
  private readonly _channelParams$ = this.authService.storageState$.pipe(
    map(({ accessToken, client, uid }) => {
      return accessToken && client && uid
        ? createHttpParams({
            'access-token': accessToken,
            client,
            uid,
          }).toString()
        : null;
    }),
  );
  private readonly _cable$ = this._channelParams$.pipe(
    map((_) => {
      if (_) {
        return this.cableService.cable(`${environment.wsBase}?${_}`);
      } else {
        this.closeConnection();
        return null;
      }
    }),
  );

  private readonly _authorizedUser = toSignal(this.authService.authorizedUser$);

  constructor(
    private cableService: ActionCableService,
    private messageService: MessagesService,
    private toastr: ToastrService,
    private router: Router,
    private readonly authService: AuthService,
  ) {}

  subscribeToSessions(conversationId: number) {
    this._cable$.subscribe((_) => {
      if (_) {
        this.sessionChannel = _.channel('MessageSessionChannel', {
          room: 'room_session_' + conversationId,
        });
        this.sessionChannel
          .received()
          .subscribe((session) => this.newSession$.next(session));
      } else {
        this.unsubscribeFromSessions();
        this.sessionChannel = undefined;
      }
    });
  }

  subscribeToMessages(conversationId: number) {
    this._cable$.subscribe((_) => {
      if (_) {
        const messageChannel = _.channel('MessageChannel', {
          room: 'room_' + conversationId,
        });

        messageChannel
          .received()
          .pipe(
            filter(
              (message: MessageWs) =>
                message.user_id !== this._authorizedUser().id &&
                !message.updated,
            ),
            tap((message: MessageWs) => {
              this.newMessage$.next(message);
              this.messageService.unreadMessages$.next(
                this.messageService.unreadMessages$.value + 1,
              );

              try {
                this.playAudio(message);
                this.showMessageToastr(message);
              } catch (e) {
                console.error(e);
              }
            }),
          )
          .subscribe();

        this.messageChannel = messageChannel;
        // @ts-ignore
        window.messageChannel = messageChannel;
      } else {
        this.unsubscribeFromMessages();
        this.messageChannel = undefined;
      }
    });
  }

  private playAudio(message: MessageWs) {
    const audio = new Audio();
    audio.oncanplaythrough = () => audio.play();

    if (
      document.hasFocus() &&
      message.conversation_id === +this.currentConversationId$.value
    ) {
      return;
    }

    switch (message.special) {
      case 'paid_feedback_request':
        this.newPaidFeedbackRequest$.next(true);
        audio.src = 'assets/audio/audio_3.mp3';
        break;
      case 'instant_feedback_request':
        audio.src = 'assets/audio/audio_2.mp3';
        break;
      default:
        audio.src = 'assets/audio/audio_4.wav';
        break;
    }

    audio.load();
  }

  private showMessageToastr(message: MessageWs) {
    const currentRoute = this.router.url;
    if (!currentRoute.includes(`conversations/${message.conversation_id}`)) {
      this.toastr.clear(); // clear all previous toasts
      this.toastr.show(undefined, undefined, {
        tapToDismiss: false,
        toastComponent: MessageNotificationComponent,
        enableHtml: false,
        positionClass: 'toast-bottom-left',
        disableTimeOut: true,
        payload: createWsMessage(message),
      });
    }
  }

  unsubscribeFromMessages() {
    this.messageChannel?.unsubscribe();
  }

  unsubscribeFromSessions() {
    this.sessionChannel?.unsubscribe();
  }

  subscribeMeetingCounter(conversationId: number) {
    this._cable$.subscribe((_) => {
      if (_) {
        this.meetCounterChannel = _.channel('MeetingChannel', {
          room: 'conversation_' + conversationId,
        });
        this.meetCounterChannel
          .received()
          .pipe(
            tap((message) => {
              this.meetCounter$.next(message);
            }),
          )
          .subscribe();
      } else {
        this.unsubscribeFromMeetingCounter();
      }
    });
  }

  sendMeetingCounter(
    conversationId: number,
    isActive: boolean,
    seconds?: number,
  ) {
    if (isActive) {
      this.meetCounterChannel.send({
        conversation_id: conversationId,
        active: isActive,
        seconds,
      });
    } else {
      this.meetCounterChannel.send({
        active: isActive,
      });
    }
  }

  unsubscribeFromMeetingCounter() {
    this.meetCounterChannel?.unsubscribe();
  }

  closeConnection(): void {
    this.cableService.disconnect(environment.wsBase);
  }

  public detectConversationSpecialMessages(message: Message | MessageWs) {
    if (message.special) {
      if (message.special === 'yes_no_question') {
        this.specialMessage$.next({
          messageType: 'yes_no_question',
          message,
        });
      }

      if (message.special === 'meeting_request') {
        this.specialMessage$.next({
          messageType: 'meeting_request',
          message,
        });
      }
    }
  }
}
