import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Toast, ToastPackage, ToastrService } from 'ngx-toastr';
import { MessageWs } from '../../models/message-ws';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-message-notification',
  templateUrl: './message-notification.component.html',
  styleUrls: ['./message-notification.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageNotificationComponent extends Toast implements OnInit {
  messagePayload: MessageWs;
  fromUser: Partial<User>;

  constructor(
    protected toastrService: ToastrService,
    public toastPackage: ToastPackage,
    private readonly router: Router,
  ) {
    super(toastrService, toastPackage);
  }

  ngOnInit() {
    this.messagePayload = this.toastPackage.config.payload;
    this.fromUser = {
      id: this.messagePayload.user_id,
      image: this.messagePayload.avatar,
    };
  }

  close() {
    this.toastrService.remove(this.toastPackage.toastId);
  }

  openNewTab(): void {
    const url = this.router.serializeUrl(
      this.router.createUrlTree([
        `/conversations/${this.messagePayload.conversation_id}`,
      ]),
    );
    this.close();
    window.open(url, '_blank');
  }

  navigateToChatRoom(): void {
    void this.router.navigate([
      `/conversations/${this.messagePayload.conversation_id}`,
    ]);
    this.close();
  }
}
