import {
  ChangeDetectionStrategy,
  Component,
  computed,
  model,
  ElementRef,
} from '@angular/core';
import { OpenRequestsService } from '../../service/open-requests.service';
import { Router } from '@angular/router';
import { CONVERSATIONS_PATH } from '../../../conversations/conversations-routing.module';
import { OpenRequestConversation } from '../../../../shared/models/conversation.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from '../../../../auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import {
  EscalationLevel,
  EscalationModalComponent,
  EscalationValue,
} from '../../../../shared/components/escalation-modal/escalation-modal.component';
import { take } from 'rxjs/operators';
import { SuccessEscalationComponent } from '../../../../shared/components/escalation-modal/success-escalation/success-escalation.component';
import { getNextLevel } from '../../../../shared/components/escalation-modal/helpers/get-next-escalation-level';

@Component({
  selector: 'app-open-request-card',
  templateUrl: './open-request-card.component.html',
  styleUrls: ['./open-request-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpenRequestCardComponent {
  public openRequestConversation = model<OpenRequestConversation>();
  readonly categoryTags = computed(() => this.openRequestConversation().topics);
  readonly currentUser = toSignal(this.authService.authorizedUser$);

  constructor(
    private readonly _openRequestService: OpenRequestsService,
    private readonly router: Router,
    private authService: AuthService,
    public readonly elementRef: ElementRef<HTMLElement>,
    private matDialog: MatDialog,
  ) {}

  enterChatroomButtonHandler() {
    this.router.navigate([
      CONVERSATIONS_PATH,
      this.openRequestConversation().id,
    ]);
  }

  switchAddToQueue() {
    if (!this.openRequestConversation().is_in_review_queue) {
      this._openRequestService.addToReviewQueue(this.openRequestConversation());
    } else {
      this._openRequestService
        .removeFromReviewQueue(this.openRequestConversation().id)
        .subscribe((res) => {
          const openRequest = this.openRequestConversation();
          openRequest.is_in_review_queue = false;
          openRequest.queued_by = openRequest.queued_by.filter(
            (user) => this.currentUser()?.id !== user.user_id,
          );
          this.openRequestConversation.set(openRequest);
          this._openRequestService.upsert(openRequest);
        });
    }
  }

  public openEscalation(): void {
    const currentRequestType = this.openRequestConversation().request_type;

    const escalateModal = this.matDialog.open(EscalationModalComponent, {
      data: {
        escalationLevel: currentRequestType,
        conversation_id: this.openRequestConversation().id,
      },
      maxWidth: '466px',
      width: '100%',
      height: 'auto',
      panelClass: 'escalation-modal',
      autoFocus: false,
    });
    escalateModal
      .afterClosed()
      .pipe(take(1))
      .subscribe((res) => {
        if (res) {
          const request_type = getNextLevel(currentRequestType);
          this.openRequestConversation.set({
            ...this.openRequestConversation(),
            request_type,
          } as OpenRequestConversation);
          this.matDialog.open(SuccessEscalationComponent, {
            data: {
              escalationLevel: request_type,
            },
            maxWidth: '466px',
            width: '100%',
            panelClass: 'escalation-modal',
            autoFocus: false,
          });
        }
      });
  }
}
