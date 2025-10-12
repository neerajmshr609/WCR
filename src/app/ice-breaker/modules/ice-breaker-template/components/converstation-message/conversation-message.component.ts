import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IceBreakerTemplateMessage } from '../../ice-breaker-template-messages';
import { takeUntil } from 'rxjs/operators';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { User } from 'src/app/shared/models/user.model';

@Component({
  selector: 'app-conversation-message',
  templateUrl: './conversation-message.component.html',
  styleUrls: ['./conversation-message.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConversationMessageComponent extends BaseComponent {
  messageText = '';
  rawMessage: IceBreakerTemplateMessage;
  constructor(private translateService: TranslateService) {
    super();
    this.translateService.store.onLangChange
      .pipe(takeUntil(this.destroyed))
      .subscribe((lang: LangChangeEvent) => {
        this.translateService.use(lang.lang);
      });
  }

  @Input() set message(message: IceBreakerTemplateMessage) {
    this.rawMessage = message;
    if (!message.isRichMedia) {
      this.messageText = message.body.replace(
        /(((https?:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/g,
        (match: string) => {
          const trimmed =
            match.length > 40 ? match.slice(0, 40) + '...' : match;
          return `<a href="${match}" title="${match}" target="_blank">${trimmed}</a>`;
        },
      );
    }
  }

  @Input() userProfile: User;
}
