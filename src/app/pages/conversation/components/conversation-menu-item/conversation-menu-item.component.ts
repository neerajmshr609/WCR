import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ActivityIconComponent } from '../../../../shared/icons/activity-icon/activity-icon.component';
import { IconClipboardComponent } from '../../../../shared/icons/icon-clipboard/icon-clipboard.component';
import { IconEventsComponent } from '../../../../shared/icons/icon-events/icon-events.component';
import { IconHashComponent } from '../../../../shared/icons/icon-hash/icon-hash.component';
import { LupaiIconComponent } from '../../../../shared/icons/lupai-icon/lupai-icon.component';
import { MessageIconComponent } from '../../../../shared/icons/message-icon/message-icon.component';
import { TaskIconComponent } from '../../../../shared/icons/task-icon/task-icon.component';
import { TranslateModule } from '@ngx-translate/core';
import { UploadIconComponent } from '../../../../shared/icons/upload-icon/upload-icon.component';
import { ConversationManageMenuItem } from '../conversation-manage-panel/manage-panel-menu';
import { JsonPipe, NgComponentOutlet, NgStyle } from '@angular/common';

@Component({
  selector: 'app-conversation-menu-item',
  templateUrl: './conversation-menu-item.component.html',
  styleUrls: ['./conversation-menu-item.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ActivityIconComponent,
    IconClipboardComponent,
    IconEventsComponent,
    IconHashComponent,
    LupaiIconComponent,
    MessageIconComponent,
    TaskIconComponent,
    TranslateModule,
    UploadIconComponent,
    NgComponentOutlet,
    NgStyle,
    JsonPipe,
  ],
})
export class ConversationMenuItemComponent {
  public onlyIconMenu = input<boolean>();
  public item = input<ConversationManageMenuItem | null>();
}
