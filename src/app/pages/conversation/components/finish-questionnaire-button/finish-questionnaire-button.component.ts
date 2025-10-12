import { Component, input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginDialogComponent } from '../../../../shared/complex-ui-components/login-dialog/login-dialog.component';
import { Router } from '@angular/router';
import { CONVERSATIONS_PATH } from '../../../conversations/conversations-routing.module';
import { AuthService } from '../../../../auth/auth.service';
import { ConversationsService } from '../../../../services/conversations.service';
import { Conversation } from '../../../../shared/models/conversation.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { ButtonComponent } from '../../../../shared/UIkit/button/button.component';
import { CompleteFlagIconComponent } from '../../../../shared/icons/complete-flag-icon/complete-flag-icon.component';
import { TranslateModule } from '@ngx-translate/core';
import { CheckIconComponent } from '../../../../shared/icons/check-icon/check-icon.component';

@Component({
  selector: 'app-finish-questionnaire-button',
  templateUrl: './finish-questionnaire-button.component.html',
  standalone: true,
  styleUrls: ['./finish-questionnaire-button.component.scss'],
  imports: [
    ButtonComponent,
    CompleteFlagIconComponent,
    TranslateModule,
    CheckIconComponent,
  ],
})
export class FinishQuestionnaireButtonComponent {
  public conversation = input<Conversation>();
  private readonly _isAnonUser = toSignal(this.authService.isAnonymousUser$);
  constructor(
    public dialog: MatDialog,
    private router: Router,
    private authService: AuthService,
    private conversationService: ConversationsService,
  ) {}

  public showLoginDialog() {
    if (this._isAnonUser()) {
      this.dialog.open(LoginDialogComponent, {
        autoFocus: true,
        width: '320px',
        panelClass: 'modal',
        data: {
          conversationId: this.conversation().id,
        },
      });
    } else {
      this.conversationService
        .endQuestionnaire(this.conversation().id)
        .subscribe(() => this.router.navigate([CONVERSATIONS_PATH]));
    }
  }
}
