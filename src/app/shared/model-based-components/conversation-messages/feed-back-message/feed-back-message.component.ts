import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  EventEmitter,
  Input,
  input,
  OnInit,
  Output,
  signal,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Message,
  MessageFile,
  MessageSpecial,
} from '../../../models/message.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { MessagesService } from '../../../../services/messages.service';
import { ProjectService } from '../../../../services/project.service';
import { MatDialog } from '@angular/material/dialog';
import { AudioRecordingService } from '../../../../services/audio-recorder';
import { LanguageService } from '../../../../services/language.service';
import { AuthService } from '../../../../auth/auth.service';
import {
  CdkConnectedOverlay,
  CdkOverlayOrigin,
  ConnectedPosition,
  ConnectionPositionPair,
} from '@angular/cdk/overlay';
import { DownloadIconComponent } from '@icons/download-icon/download-icon.component';
import { GetIframeModule } from '../../../../ice-breaker/modules/ice-breakers-list-old/ice-breaker-card-module/components/ice-breaker-card/pipes/get-iframe/get-iframe.module';
import { IframelyEmbedModule } from '../../../../ice-breaker/modules/ice-breakers-list-old/ice-breaker-card-module/components/iframely-embed/iframely-embed.module';
import { MatIcon } from '@angular/material/icon';
import { PipesModule } from '../../../pipes/pipes.module';
import { SharedModule } from '../../../shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { TrashIconComponent } from '@icons/trash-icon/trash-icon.component';
import { YouTubePlayer } from '@angular/youtube-player';
import moment from 'moment/moment';
import { NewsfeedFeedback } from '../../../models/newsfeedfeedback.model';
import { IConversationUserInfo } from '../../../models/conversation.model';
import { getRandomAvatarSrc } from '../../../../pages/usersettings/constants/avatars';
import { Observable, of } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { ConfirmDialogComponent } from '../../../components/confirm-dialog/confirm-dialog.component';
import { ViewFileComponent } from '../../../components/view-file/view-file.component';
import { HeartIconComponent } from '@icons/heart-icon/heart-icon.component';

@Component({
  selector: 'app-feed-back-message',
  standalone: true,
  templateUrl: './feed-back-message.component.html',
  styleUrls: ['./feed-back-message.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HeartIconComponent],
})
export class FeedBackMessageComponent {
  public message = input.required<Message>();
  public direction = input<'left' | 'right'>('left');
  readonly avatarSrc = computed(() => {
    const message = this.message();
    return message?.user?.image || getRandomAvatarSrc(message.user_id);
  });
}
