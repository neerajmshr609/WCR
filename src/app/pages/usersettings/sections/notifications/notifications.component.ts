import {
  ChangeDetectionStrategy,
  Component,
  input,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { Permisson } from '../../interfaces';
import { User } from 'src/app/shared/models/user.model';
import { AuthService } from 'src/app/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, debounceTime, EMPTY } from 'rxjs';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { UntypedFormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationsComponent
  extends BaseComponent
  implements OnInit, OnDestroy
{
  currentUser = input<User>();

  switchSubscription = signal<boolean>(false);
  controlForNewMessageEmailNotification = new UntypedFormControl();
  permissions: Permisson[] = [
    {
      name: 'notification.new_message_notification.title',
      description: 'notification.new_message_notification.description',
      control: this.controlForNewMessageEmailNotification,
    },
  ];

  constructor(
    public authService: AuthService,
    private snackBar: MatSnackBar,
    private translate: TranslateService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.controlForNewMessageEmailNotification.setValue(
      this.currentUser()?.conversations_muted,
    );

    this.handleSwitchEmailNotification();
  }

  public handleSwitchEmailNotification(): void {
    this.controlForNewMessageEmailNotification.valueChanges
      .pipe(debounceTime(1000))
      .subscribe(() => {
        this.authService
          .switchEmailNotification()
          .pipe(
            catchError(() => {
              this.errorSnackBar();
              return EMPTY;
            }),
          )
          .subscribe((res) => {
            if (!res.success) {
              this.errorSnackBar();
            } else {
              this.translate
                .get('notification.success_message')
                .subscribe((message) => {
                  this.snackBar.open(message, null, {
                    duration: 3000,
                  });
                });
            }
          });
      });
  }

  private errorSnackBar(): void {
    this.translate.get('notification.error_message').subscribe((message) => {
      this.snackBar.open(message, null, {
        duration: 3000,
      });
    });
  }
}
